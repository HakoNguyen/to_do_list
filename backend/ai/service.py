import re, json
from typing import Optional, Dict
from datetime import datetime, timedelta
from .client import client
from .prompts import SYSTEM_PROMPT
from models.schemas import AiTaskDraft

def call_gemma(messages: list[Dict[str, str]]) -> str:
    combined = "\n\n".join([m.get("content", "") for m in messages])
    resp = client.chat.completions.create(
        model="mistralai/mistral-7b-instruct:free",
        messages=[{"role": "user", "content": combined}],
    )
    return resp.choices[0].message.content

def parse_task_from_reply(raw_reply: str, user_prompt: str | None = None) -> Optional[AiTaskDraft]:
    candidates = re.findall(r"\{[^\n\r]*\}", raw_reply)
    if candidates:
        for cand in reversed(candidates):
            try:
                obj = json.loads(cand)
                if all(k in obj for k in ["title", "deadline", "priority"]):
                    pr = str(obj.get("priority", "medium")).lower()
                    if pr not in ["low", "medium", "high"]:
                        pr = "medium"
                    title = str(obj.get("title", "")).strip()
                    if not title and user_prompt:
                        title = extract_title_from_prompt(user_prompt)
                    
                    # Cải thiện deadline parsing
                    deadline = str(obj["deadline"]).strip()
                    if user_prompt:
                        deadline = parse_vietnamese_date(deadline, user_prompt)
                    
                    return AiTaskDraft(
                        title=title or "Công việc mới",
                        deadline=deadline,
                        priority=pr,  
                    )
            except Exception:
                continue
    return None


def extract_title_from_prompt(prompt: str) -> str:
    p = (prompt or "").strip()
    if not p:
        return "Công việc mới"

    meet = re.search(r"(họp|gặp|meeting|call|phỏng vấn|trao đổi)[^,.!?]*", p, flags=re.I)
    if meet:
        return capitalize(meet.group(0).strip())

    t = re.sub(r"^nhắc( tôi| mình| tớ| em| anh| chị)?\s*", "", p, flags=re.I)
    t = re.sub(r"^(mai|ngày mai|chiều mai|sáng mai|tối mai)\s*", "", t, flags=re.I)
    t = re.sub(r"^\d{1,2}(h|:\d{2})\s*", "", t, flags=re.I)
    t = re.sub(r"^\d{4}-\d{2}-\d{2}\s*", "", t, flags=re.I)
    t = re.sub(r"^(thứ|cn)\s*\d\s*", "", t, flags=re.I)
    t = t.strip()
    return capitalize(t) if t else "Công việc mới"


def parse_vietnamese_date(deadline: str, user_prompt: str) -> str:
    """
    Parse Vietnamese date expressions and convert to ISO format
    """
    now = datetime.now()
    prompt_lower = user_prompt.lower()
    
    
    try:
        datetime.fromisoformat(deadline.replace('Z', '+00:00'))
        return deadline
    except:
        pass
    
    # Xử lý các từ khóa tiếng Việt
    target_date = None
    target_time = "09:00:00"
    
    # Tìm giờ trong prompt
    time_patterns = [
        (r'(\d{1,2})h\s*(\d{2})?', r'\1:\2' if re.search(r'(\d{1,2})h\s*(\d{2})', prompt_lower) else r'\1:00'),
        (r'(\d{1,2}):(\d{2})', r'\1:\2'),
        (r'(\d{1,2})\s*giờ', r'\1:00'),
    ]
    
    for pattern, replacement in time_patterns:
        time_match = re.search(pattern, prompt_lower)
        if time_match:
            time_str = re.sub(pattern, replacement, time_match.group(0))
            if ':' in time_str and len(time_str.split(':')) == 2:
                target_time = time_str + ":00"
            break
    
    # Xử lý ngày
    if 'mai' in prompt_lower or 'ngày mai' in prompt_lower:
        target_date = now + timedelta(days=1)
    elif 'tuần tới' in prompt_lower or 'tuần sau' in prompt_lower:
        # Thứ 2 tuần tới
        days_until_monday = (7 - now.weekday()) % 7
        if days_until_monday == 0:  
            days_until_monday = 7
        target_date = now + timedelta(days=days_until_monday)
    elif 'cuối tuần' in prompt_lower:
        # Chủ nhật tuần này
        days_until_sunday = (6 - now.weekday()) % 7
        if days_until_sunday == 0:  
            days_until_sunday = 7
        target_date = now + timedelta(days=days_until_sunday)
    elif 'tuần này' in prompt_lower:
        # Ngẫu nhiên trong tuần này (thứ 6)
        days_until_friday = (4 - now.weekday()) % 7
        if days_until_friday == 0:  # Nếu hôm nay là thứ 6
            days_until_friday = 7
        target_date = now + timedelta(days=days_until_friday)
    elif 'tháng tới' in prompt_lower or 'tháng sau' in prompt_lower:
        # Ngày đầu tháng sau
        if now.month == 12:
            target_date = datetime(now.year + 1, 1, 1)
        else:
            target_date = datetime(now.year, now.month + 1, 1)
    else:
        # Tìm số ngày (VD: "2 ngày nữa", "3 ngày nữa")
        days_match = re.search(r'(\d+)\s*ngày\s*nữa', prompt_lower)
        if days_match:
            days = int(days_match.group(1))
            target_date = now + timedelta(days=days)
    
    # Nếu tìm được target_date, tạo ISO string
    if target_date:
        # Kết hợp ngày và giờ
        if target_time:
            hour, minute, second = target_time.split(':')
            target_date = target_date.replace(hour=int(hour), minute=int(minute), second=int(second))
        
        return target_date.isoformat()
    
    # Fallback: trả về deadline gốc hoặc ngày hiện tại
    try:
       
        parsed_date = datetime.fromisoformat(deadline.replace('Z', '+00:00'))
        return parsed_date.isoformat()
    except:
        
        return now.isoformat()


def capitalize(s: str) -> str:
    if not s:
        return s
    return s[0].upper() + s[1:]

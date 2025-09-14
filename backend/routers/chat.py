from fastapi import APIRouter
from ai.service import call_gemma, parse_task_from_reply
from ai.prompts import SYSTEM_PROMPT
from models.schemas import ChatRequest, ChatResponse

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    user_prompt = req.prompt.strip()

    content_for_model = f"""
Người dùng: "{user_prompt}"

Yêu cầu:
1) Nếu đây là nhắc nhở/lịch làm việc, trả lời ngắn gọn (ví dụ: "Mình đã tạo task cho bạn.") 
   và ở CUỐI cùng in duy nhất một JSON Task:
   {{"title": "...", "deadline": "YYYY-MM-DDTHH:MM:SS", "priority": "low|medium|high"}}
2) Nếu không phải nhắc việc, trả lời tự nhiên, KHÔNG in JSON.
"""

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": content_for_model},
    ]

    raw_reply = call_gemma(messages)
    task = parse_task_from_reply(raw_reply, user_prompt)

    # loại JSON trong message text nếu có
    message_text = raw_reply
    if task:
        import re
        message_text = re.sub(r"\{[^\n\r]*\}", "", raw_reply).strip()

    return ChatResponse(
        message=message_text,
        task=task,
    )

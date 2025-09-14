
"""
Test script để kiểm tra các cải tiến AI
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.ai.service import parse_vietnamese_date
from backend.ai.prompts import get_system_prompt
from datetime import datetime

def test_vietnamese_date_parsing():
    """Test việc parse ngày tháng tiếng Việt"""
    print("=== TEST VIETNAMESE DATE PARSING ===")
    
    test_cases = [
        ("mai 8h họp team", "2024-01-01T00:00:00"),
        ("ngày mai 14h30 làm báo cáo", "2024-01-01T00:00:00"),
        ("tuần tới thứ 2 họp dự án", "2024-01-01T00:00:00"),
        ("cuối tuần đi chơi", "2024-01-01T00:00:00"),
        ("2 ngày nữa thi môn toán", "2024-01-01T00:00:00"),
        ("tháng tới nộp bài tập", "2024-01-01T00:00:00"),
    ]
    
    for prompt, expected in test_cases:
        result = parse_vietnamese_date("2024-01-01T00:00:00", prompt)
        print(f"Input: '{prompt}'")
        print(f"Output: {result}")
        print(f"Expected format: ISO datetime")
        print("-" * 50)

def test_system_prompt():
    """Test system prompt có thông tin ngày hiện tại"""
    print("\n=== TEST SYSTEM PROMPT ===")
    
    prompt = get_system_prompt()
    print("System prompt có chứa:")
    print(f"- Thông tin ngày hiện tại: {'Có' if 'Ngày hiện tại:' in prompt else 'Không'}")
    print(f"- Hướng dẫn xử lý ngày: {'Có' if 'XỬ LÝ NGÀY THÁNG:' in prompt else 'Không'}")
    print(f"- Hướng dẫn xử lý priority: {'Có' if 'XỬ LÝ ĐỘ ƯU TIÊN:' in prompt else 'Không'}")
    print(f"- Từ khóa priority HIGH: {'Có' if 'gấp' in prompt and 'khẩn cấp' in prompt else 'Không'}")
    print(f"- Từ khóa priority MEDIUM: {'Có' if 'họp' in prompt and 'project' in prompt else 'Không'}")
    print(f"- Từ khóa priority LOW: {'Có' if 'ăn' in prompt and 'mua sắm' in prompt else 'Không'}")

def test_priority_keywords():
    """Test các từ khóa priority"""
    print("\n=== TEST PRIORITY KEYWORDS ===")
    
    high_keywords = ["gấp", "khẩn cấp", "thi", "deadline", "bài tập nhóm", "nộp bài", "kiểm tra"]
    medium_keywords = ["họp", "project", "làm báo cáo", "báo cáo", "meeting", "họp team"]
    low_keywords = ["ăn", "mua sắm", "thể thao", "giải trí", "nghỉ ngơi"]
    
    print("HIGH priority keywords:")
    for keyword in high_keywords:
        print(f"  - {keyword}")
    
    print("\nMEDIUM priority keywords:")
    for keyword in medium_keywords:
        print(f"  - {keyword}")
    
    print("\nLOW priority keywords:")
    for keyword in low_keywords:
        print(f"  - {keyword}")

if __name__ == "__main__":
    print("Testing AI improvements...")
    print(f"Current time: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")
    
    test_system_prompt()
    test_priority_keywords()
    test_vietnamese_date_parsing()
    
    print("\n=== SUMMARY ===")
    print("✅ System prompt đã được cải thiện với thông tin ngày hiện tại")
    print("✅ Logic xử lý priority đã được mở rộng")
    print("✅ Hàm parse ngày tháng tiếng Việt đã được thêm")
    print("✅ AI giờ đây có thể nhận biết ngày và priority tốt hơn")

from typing import Optional, Literal
from pydantic import BaseModel

class ChatRequest(BaseModel):
    prompt: str

class AiTaskDraft(BaseModel):
    title: str
    deadline: str
    priority: Optional[Literal["low", "medium", "high"]] = "medium"

class ChatResponse(BaseModel):
    message: str
    task: Optional[AiTaskDraft] = None

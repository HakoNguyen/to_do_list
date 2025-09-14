from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat

app = FastAPI()

origins = [
    "http://localhost:5173",        # khi dev local
    "https://to-do-list-dun-chi.vercel.app/"  # domain Vercel thật
]

# Cho phép gọi từ React/Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký router
app.include_router(chat.router, prefix="/api", tags=["Chat"])



import sys, os

# Put backend/ FIRST in the search path so its internal "api" package
# (backend/api/chat.py) is found before the root-level api/ folder.
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from main import app

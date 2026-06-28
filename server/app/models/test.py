from sqlalchemy import Column, Integer, String
from core import Base


class Test(Base):
    __tablename__ = "test"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

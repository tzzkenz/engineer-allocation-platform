"""remove_unique_employeeskill

Revision ID: 177e7fade9f8
Revises: 18863f214926
Create Date: 2026-06-29 17:50:26.393487

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '177e7fade9f8'
down_revision: Union[str, Sequence[str], None] = '03ec25e6a304'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade(): 
    """Upgrade schema."""
    op.drop_constraint( constraint_name='uq_employee_stack', table_name='employee_skills', type_='unique' )

def downgrade():
    """Downgrade schema."""
    op.create_unique_constraint( constraint_name='uq_employee_stack', table_name='employee_skills', columns=['employee_id', 'skill_id'] )


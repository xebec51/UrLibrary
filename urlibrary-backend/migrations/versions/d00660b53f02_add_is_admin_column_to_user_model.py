"""Add is_admin column to User model

Revision ID: d00660b53f02
Revises: a425d95c7727
Create Date: 2025-06-25 08:28:13.213419

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
# Pastikan nilai ini sesuai dengan nama file Anda
revision = 'd00660b53f02' 
# Pastikan nilai ini sesuai dengan ID revisi sebelumnya di file Anda
down_revision = 'a425d95c7727'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - Ganti dengan kode di bawah ###
    
    # Langkah 1: Tambahkan kolom baru, tapi izinkan NULL untuk sementara
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_admin', sa.Boolean(), nullable=True, server_default=sa.false()))

    # Langkah 2: Isi semua baris data yang sudah ada dengan nilai default 'false'
    op.execute('UPDATE "user" SET is_admin = 0')

    # Langkah 3: Setelah semua baris terisi, ubah kolom menjadi NOT NULL
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column('is_admin',
               existing_type=sa.BOOLEAN(),
               nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('is_admin')
    # ### end Alembic commands ###

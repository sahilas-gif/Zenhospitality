from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import PageContent, User
from app.schemas import PageContentCreate, PageContentResponse
from app.auth import require_admin

router = APIRouter()


@router.get("/pages/{slug}", response_model=PageContentResponse)
async def get_page_content(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PageContent).where(PageContent.slug == slug))
    page = result.scalar_one_or_none()
    if not page:
        raise HTTPException(status_code=404, detail="Page content not found")
    return page


@router.put("/admin/pages/{slug}", response_model=PageContentResponse)
async def update_page_content(
    slug: str,
    page_data: PageContentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    result = await db.execute(select(PageContent).where(PageContent.slug == slug))
    page = result.scalar_one_or_none()

    if page:
        page.content = page_data.content
    else:
        page = PageContent(slug=slug, content=page_data.content)
        db.add(page)

    await db.commit()
    await db.refresh(page)
    return page

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ records: [] });
  }

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/appg7FNujPR80utKW/tblXaC6hhIapyJHJc?filterByFormula=SEARCH(LOWER("${query}"), LOWER(Name))`,
      {
        headers: {
          'Authorization': 'Bearer patP9tO6YFWcHPk1c.1f65865185e5e9117dd25adf5f80eebcfbedad45e37f1bfc4737eefa8b2a27c7',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Airtable');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to search records' }, { status: 500 });
  }
} 
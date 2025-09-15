import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const filePath = join(process.cwd(), 'public', 'uploads', ...path);
    
    console.log('Attempting to serve file:', filePath);
    
    const fileBuffer = await readFile(filePath);
    
    // Get file extension for content type
    const ext = path[path.length - 1].split('.').pop()?.toLowerCase();
    const contentType = getContentType(ext || '');
    
    return new Response(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('File not found', { status: 404 });
  }
}

function getContentType(ext: string): string {
  const types: { [key: string]: string } = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
  };
  
  return types[ext] || 'application/octet-stream';
}
import { NextResponse } from 'next/server';
import { existsSync, statSync, readdirSync } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), 'public/uploads');
    const publicDir = path.join(process.cwd(), 'public');
    
    const fileSystemStatus = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      processInfo: {
        cwd: process.cwd(),
        uid: process.getuid ? process.getuid() : 'N/A',
        gid: process.getgid ? process.getgid() : 'N/A',
      },
      directories: {
        public: {
          path: publicDir,
          exists: existsSync(publicDir),
          stats: existsSync(publicDir) ? statSync(publicDir) : null,
          contents: existsSync(publicDir) ? readdirSync(publicDir) : null,
        },
        uploads: {
          path: uploadsDir,
          exists: existsSync(uploadsDir),
          stats: existsSync(uploadsDir) ? statSync(uploadsDir) : null,
          contents: existsSync(uploadsDir) ? readdirSync(uploadsDir) : null,
        }
      }
    };

    return NextResponse.json({
      success: true,
      data: fileSystemStatus
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
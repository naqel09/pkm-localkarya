import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 [UPLOAD] Starting file upload process...');
    
    const data = await request.formData();
    console.log('📝 [UPLOAD] FormData entries:', Array.from(data.entries()).map(([key, value]) => {
      if (value instanceof File) {
        return [key, `File: ${value.name} (${value.size} bytes, ${value.type})`];
      }
      return [key, value];
    }));
    
    const file: File | null = data.get('file') as unknown as File;
    console.log('📁 [UPLOAD] File detection status:', {
      hasFile: !!file,
      fileName: file?.name || 'N/A',
      fileSize: file?.size || 'N/A',
      fileType: file?.type || 'N/A'
    });

    if (!file) {
      console.log('❌ [UPLOAD] No file found in FormData');
      return NextResponse.json({ 
        success: false, 
        message: 'No file uploaded' 
      }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    console.log('🔍 [UPLOAD] File type validation:', {
      fileType: file.type,
      allowedTypes,
      isValid: allowedTypes.includes(file.type)
    });
    
    if (!allowedTypes.includes(file.type)) {
      console.log('❌ [UPLOAD] Invalid file type:', file.type);
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid file type. Only JPEG, PNG, and GIF are allowed.' 
      }, { status: 400 });
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    console.log('📎 [UPLOAD] File size validation:', {
      fileSize: file.size,
      maxSize,
      fileSizeMB: (file.size / (1024 * 1024)).toFixed(2) + 'MB',
      isValid: file.size <= maxSize
    });
    
    if (file.size > maxSize) {
      console.log('❌ [UPLOAD] File too large:', file.size, 'bytes');
      return NextResponse.json({ 
        success: false, 
        message: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log('💾 [UPLOAD] File buffer created:', {
      bufferSize: buffer.length,
      bufferType: typeof buffer
    });

    // Create unique filename with timestamp
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // Sanitize filename
    const filename = `${timestamp}-${originalName}`;
    console.log('📝 [UPLOAD] Filename generation:', {
      originalName: file.name,
      sanitizedName: originalName,
      finalFilename: filename,
      timestamp
    });
    
    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public/uploads');
    console.log('📁 [UPLOAD] Directory check:', {
      uploadsDir,
      exists: existsSync(uploadsDir),
      cwd: process.cwd()
    });
    
    if (!existsSync(uploadsDir)) {
      console.log('📁 [UPLOAD] Creating uploads directory...');
      mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ [UPLOAD] Uploads directory created successfully');
    }

    const filePath = path.join(uploadsDir, filename);
    console.log('💾 [UPLOAD] Writing file to:', filePath);
    
    await writeFile(filePath, buffer);
    console.log('✅ [UPLOAD] File saved successfully:', {
      filePath,
      filename,
      fileExists: existsSync(filePath)
    });

    const response = {
      success: true, 
      filename: filename,
      path: `/uploads/${filename}`,
      message: 'File uploaded successfully' 
    };
    console.log('✅ [UPLOAD] Returning success response:', response);
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ [UPLOAD] Upload error occurred:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error
    });
    
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
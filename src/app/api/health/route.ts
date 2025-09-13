import { NextRequest, NextResponse } from 'next/server';
import { AppDataSource } from '@/backend/db/data-source';

export async function GET(request: NextRequest) {
  try {
    // Check if database connection is working
    let dbStatus = 'disconnected';
    let dbMessage = '';
    
    try {
      if (AppDataSource.isInitialized) {
        // Test database connection with a simple query
        await AppDataSource.query('SELECT 1');
        dbStatus = 'connected';
        dbMessage = 'Database connection successful';
      } else {
        dbStatus = 'not_initialized';
        dbMessage = 'Database not initialized';
      }
    } catch (error) {
      dbStatus = 'error';
      dbMessage = error instanceof Error ? error.message : 'Unknown database error';
    }

    // Get system information
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'unknown',
      version: process.env.npm_package_version || '1.0.0',
      database: {
        status: dbStatus,
        message: dbMessage,
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024),
      },
      node: {
        version: process.version,
        platform: process.platform,
        arch: process.arch,
      }
    };

    // Determine overall health status
    if (dbStatus === 'error' || dbStatus === 'disconnected') {
      healthCheck.status = 'unhealthy';
      return NextResponse.json(healthCheck, { status: 503 });
    }

    return NextResponse.json(healthCheck, { status: 200 });
  } catch (error) {
    const errorResponse = {
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      uptime: process.uptime(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
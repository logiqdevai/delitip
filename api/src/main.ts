import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Deployed behind one reverse-proxy hop (Coolify/Traefik) — without this,
  // request.ip resolves to the proxy's internal address, which breaks
  // VivaIpAllowlistGuard (it can never match Viva's real public IP).
  app.set('trust proxy', 1);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Appointly API')
    .setDescription('The Appointly API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const enabledCors = process.env.NODE_ENV !== 'local' ? [process.env.APP_URL, process.env.LANDING_URL] : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3001'];


  app.enableCors({
    origin: enabledCors,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Access-Control-Allow-Origin'],
  });

  await app.listen(3000);
}
bootstrap();

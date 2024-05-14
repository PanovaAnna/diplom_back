import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { readFileSync } from 'fs'
import { join } from 'path'
import * as process from 'process'
import { AppModule } from './app.module'

async function bootstrap() {
	const httpsOptions = {
		key: readFileSync(process.env.KEY_PATH),
		cert: readFileSync(process.env.CERT_PATH),
	}

	const app = await NestFactory.create<NestExpressApplication>(AppModule, { httpsOptions })
	app.useStaticAssets(join(__dirname, '..', 'public'), {
		prefix: '/public/',
	})
	const PORT = process.env.PORT
	const config = new DocumentBuilder().setTitle('DeliveryDubna documentation').setDescription('Документация Api').setVersion('1.0.0').build()

	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('/api/docs', app, document)

	app.setGlobalPrefix('api/v1')
	app.enableCors({ origin: true })
	await app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`))
}
bootstrap()

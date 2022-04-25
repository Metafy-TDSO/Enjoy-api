import 'reflect-metadata'

import fastify from 'fastify'
import cors from 'fastify-cors'
import helmet from 'fastify-helmet'
import socketio from 'fastify-socket.io'

import { WsGateway } from '@modules/gateways'
import { wsAuthenticationMiddleware } from '@modules/gateways/middlewares'

import { IS_PROD } from './common/constants/envs'
import { creatorRouter } from './modules/creators'
import { eventRouter } from './modules/events'
import { userRouter } from './modules/users'

export const app = fastify({
  logger: {
    prettyPrint: !IS_PROD
      ? {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname'
        }
      : false
  }
})

app.register(cors, { allowedHeaders: '*' })
app.register(helmet)
app.register(socketio, { cors: { allowedHeaders: '*' } })

app.get('/', (_req, rep) => {
  rep.status(200).send({ ok: true })
})
app.get('/document', (_req, rep) => {
  rep.send(`
    <script type="text/javascript">
      var script = document.createElement("script");
      script.src="https://dxjs.apimatic.io/v7/static/js/portal.v7.js";
      script.onload = function() {
          APIMaticDevPortal.show(
              {
          "container": "apimatic-widget",
          "portalStyle": "default",
          "codegenApiRoutes": {
            "docsgen": "/api/api-entities/97fZAolB7w2dg9G2-fZmq1ubPE0NJDbqHGt-JZ_cOWWL1UWgqCPSpVeVKRYjcMA6/portal-artifacts/docs/generated-file?template={template}",
            "codegen": "/api/api-entities/97fZAolB7w2dg9G2-fZmq1ubPE0NJDbqHGt-JZ_cOWWL1UWgqCPSpVeVKRYjcMA6/portal-artifacts/sdks/generated-file?template={template}",
            "transform": "/api/api-entities/97fZAolB7w2dg9G2-fZmq1ubPE0NJDbqHGt-JZ_cOWWL1UWgqCPSpVeVKRYjcMA6/portal-artifacts/specs/generated-file?format={format}",
            "apiProxy": "https://proxy.apimatic.io/api/proxy"
          },
          "apiKey": "PkUYNyvjYA7DfFBwoKTjTKXmTsB_MqUPck1yCvnKJtIGu9fTgtU2gkEIktXkLS13hG02C3vA7cxBjTRLuUUr8A**",
          "baseUrl": "https://www.apimatic.io",
          "enableExport": true,
          "renameHttpToRest": false,
          "enableConsoleCalls": true,
          "useProxyForConsoleCalls": true,
          "initialPlatform": "http_curl_v1",
          "languageSettings": {
            "http_curl_v1": {
              "disableSdkDownload": true
            },
            "java_eclipse_jre_lib": {
              "disableSdkDownload": false,
              "sdkDownloadLink": ""
            },
            "php_generic_lib_v2": {
              "disableSdkDownload": false,
              "sdkDownloadLink": ""
            },
            "python_generic_lib": {
              "disableSdkDownload": false,
              "sdkDownloadLink": ""
            },
            "ts_generic_lib": {
              "disableSdkDownload": false,
              "sdkDownloadLink": ""
            }
          },
          "allowedExportFormats": [
            "openapi31json",
            "openapi31yaml",
            "openapi3json",
            "openapi3yaml",
            "swagger20",
            "swaggeryaml",
            "swagger10",
            "raml",
            "raml10",
            "apiblueprint",
            "insomnia",
            "insomniayaml",
            "wadl2009",
            "wsdl",
            "apimatic",
            "postman10",
            "postman20"
          ],
          "themeOverrides": {
            "themeType": "cool",
            "palette": {
              "primaryColor": "#000333",
              "linkColor": "#00C7D4"
            },
            "fontSource": [
              "https://fonts.googleapis.com/css?family=Montserrat",
              "https://fonts.googleapis.com/css?family='SFMono-400'"
            ],
            "cssStyles": {
              "headings": {
                "fontFamily": "Montserrat, sans-serif",
                "h1": {
                  "fontFamily": "Montserrat, sans-serif",
                  "fontSize": "27px",
                  "fontWeight": "500",
                  "fontStyle": "normal",
                  "lineHeight": "1.3"
                },
                "h2": {
                  "fontFamily": "Montserrat, sans-serif",
                  "fontSize": "27px",
                  "fontWeight": "500",
                  "fontStyle": "normal",
                  "lineHeight": "1.3"
                },
                "h3": {
                  "fontFamily": "Montserrat, sans-serif",
                  "fontSize": "27px",
                  "fontWeight": "500",
                  "fontStyle": "normal",
                  "lineHeight": "1.3"
                },
                "h4": {
                  "fontFamily": "Montserrat, sans-serif",
                  "fontSize": "27px",
                  "fontWeight": "500",
                  "fontStyle": "normal",
                  "lineHeight": "1.3"
                },
                "h5": {
                  "fontFamily": "Montserrat, sans-serif",
                  "fontSize": "27px",
                  "fontWeight": "500",
                  "fontStyle": "normal",
                  "lineHeight": "1.3"
                },
                "h6": {
                  "fontFamily": "Montserrat, sans-serif",
                  "fontSize": "27px",
                  "fontWeight": "500",
                  "fontStyle": "normal",
                  "lineHeight": "1.3"
                }
              },
              "body": {
                "fontFamily": "Montserrat, sans-serif",
                "text1": {
                  "fontFamily": "Montserrat, sans-serif",
                  "fontSize": "15px",
                  "fontWeight": "400",
                  "fontStyle": "normal",
                  "lineHeight": "1.75"
                },
                "text2": {
                  "fontFamily": "Montserrat, sans-serif",
                  "fontSize": "13.33px",
                  "fontWeight": "400",
                  "fontStyle": "normal",
                  "lineHeight": "1.75"
                },
                "text3": {
                  "fontFamily": "Montserrat, sans-serif",
                  "fontSize": "11.85px",
                  "fontWeight": "400",
                  "fontStyle": "normal",
                  "lineHeight": "1.75"
                }
              },
              "code": {
                "fontFamily": "'SFMono-400', Consolas, 'Liberation Mono', Menlo, Courier",
                "blockCode": {
                  "fontFamily": "'SFMono-400', Consolas, 'Liberation Mono', Menlo, Courier",
                  "fontSize": "15px",
                  "fontWeight": "400",
                  "fontStyle": "normal",
                  "lineHeight": "1.75"
                },
                "inlineCode": {
                  "fontFamily": "'SFMono-400', Consolas, 'Liberation Mono', Menlo, Courier",
                  "fontSize": "15px",
                  "fontWeight": "400",
                  "fontStyle": "normal",
                  "lineHeight": "1.75"
                }
              }
            }
          }
        }
        );
    };
    document.getElementsByTagName("head")[0].appendChild(script);
    </script>
    <div id="apimatic-widget" style="height: 100%; width: 100%;">
    </div>
  `)
})

app.register(userRouter, { prefix: '/users' })
app.register(creatorRouter, { prefix: '/creator' })
app.register(eventRouter, { prefix: '/events' })

app.ready().then(() => {
  const gateway = WsGateway.getInstance()
  app.io.use(wsAuthenticationMiddleware)
  app.io.on('connection', socket => gateway.onConnection({ io: app.io, socket }))
})

import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import QOper8 from 'qoper8-fastify';

const fastify = Fastify({
  logger: false
});

fastify.register(fastifyStatic, {
  root: '/opt/mgateway/mapped/www',
  prefix: '/',
  maxAge: '23h'
});

let logging = process.argv[2] || false;

const options = {
  mode: 'child_process',
  logging: logging,
  poolSize: 2,
  exitOnStop: true,
  mgdbx: {
    open: {
      type: "YottaDB",
      path: "/usr/local/lib/yottadb/r138",
      env_vars: {
        ydb_gbldir: '/opt/yottadb/yottadb.gld',
        ydb_routines: '/opt/mgateway/m /usr/local/lib/yottadb/r138/libyottadbutil.so',
        ydb_ci: '/usr/local/lib/yottadb/r138/zmgsi.ci'
      }
    }
  },
  workerHandlersByRoute: [
    {
      method: 'get',
      url: '/helloworld',
      handlerPath: 'handlers/getHelloWorld.mjs'
    },
    {
      method: 'post',
      url: '/user',
      handlerPath: 'handlers/addUser.mjs'
    },
    {
      method: 'get',
      url: '/user/:id',
      handlerPath: 'handlers/getUser.mjs'
    },
    {
      method: 'get',
      url: '/viewer/globaldirectory',
      handlerPath: 'handlers/getGlobalDirectory.mjs'
    },
    {
      method: 'get',
      url: '/viewer/documentNode/:documentName',
      handlerPath: 'handlers/getDocumentNode.mjs'
    },
    {
      method: 'post',
      url: '/viewer/getChildNodes',
      handlerPath: 'handlers/getChildNodes.mjs'
    }
  ]
};

fastify.register(QOper8, options);

fastify.get('/local', function (req, reply) {
  reply.send({
    api: '/local',
    ok: true,
    from: 'Fastify'
  });
});

fastify.setNotFoundHandler((request, reply) => {
  let error = {error: 'Not found: ' + request.url};
  reply.code(404).type('application/json').send(JSON.stringify(error));
});

await fastify.listen({ port: 8080, host: '0.0.0.0' }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
});


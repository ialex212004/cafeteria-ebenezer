describe('Auth middleware', () => {
  let auth;

  beforeEach(() => {
    jest.resetModules();
    process.env.API_KEY = 'test-admin-key';
    auth = require('../middleware/auth');
  });

  function createMockResponse() {
    return {
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      },
    };
  }

  test('hasValidAdminKey acepta X-API-Key válida', () => {
    const req = { headers: { 'x-api-key': 'test-admin-key' } };
    expect(auth.hasValidAdminKey(req)).toBe(true);
  });

  test('hasValidAdminKey acepta Authorization Bearer válida', () => {
    const req = { headers: { authorization: 'Bearer test-admin-key' } };
    expect(auth.hasValidAdminKey(req)).toBe(true);
  });

  test('hasValidAdminKey rechaza key inválida', () => {
    const req = { headers: { 'x-api-key': 'otra-key' } };
    expect(auth.hasValidAdminKey(req)).toBe(false);
  });

  test('requireAdminAuth bloquea cuando no hay credenciales', () => {
    const req = { headers: {}, path: '/api/pedidos', method: 'GET', ip: '127.0.0.1' };
    const res = createMockResponse();
    const next = jest.fn();

    auth.requireAdminAuth(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe(true);
    expect(next).not.toHaveBeenCalled();
  });

  test('requireAdminAuth permite continuar con credenciales válidas', () => {
    const req = {
      headers: { 'x-api-key': 'test-admin-key' },
      path: '/api/pedidos',
      method: 'GET',
      ip: '127.0.0.1',
    };
    const res = createMockResponse();
    const next = jest.fn();

    auth.requireAdminAuth(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(200);
  });
});

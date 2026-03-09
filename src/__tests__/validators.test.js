const validators = require('../validators');

describe('Validators', () => {
  test('valida pedido correcto', () => {
    const validPedido = {
      nombre: 'Juan',
      telefono: '+34 600 000 000',
      producto: 'Bocadillo cubano',
      cantidad: 2,
      notas: 'Sin cebolla',
    };

    const result = validators.validate(validators.schemas.pedido, validPedido);

    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
    expect(result.value.nombre).toBe('Juan');
  });

  test('rechaza pedido sin telefono', () => {
    const invalidPedido = {
      nombre: 'Juan',
      producto: 'Bocadillo cubano',
      cantidad: 2,
    };

    const result = validators.validate(validators.schemas.pedido, invalidPedido);

    expect(result.valid).toBe(false);
    expect(result.error.join(' ')).toMatch(/tel[eé]fono/i);
  });

  test('valida actualización de estado permitida', () => {
    const result = validators.validate(validators.schemas.actualizarPedido, {
      estado: 'confirmado',
    });

    expect(result.valid).toBe(true);
    expect(result.value.estado).toBe('confirmado');
  });

  test('rechaza estado no permitido', () => {
    const result = validators.validate(validators.schemas.actualizarPedido, {
      estado: 'cancelado',
    });

    expect(result.valid).toBe(false);
    expect(result.error.join(' ')).toMatch(/estado/i);
  });
});

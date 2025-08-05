describe('Simple Test', () => {
  test('debe sumar dos números correctamente', () => {
    expect(1 + 2).toBe(3);
  });

  test('debe verificar que un string contiene texto', () => {
    expect('Hola Mundo').toContain('Hola');
  });
}); 
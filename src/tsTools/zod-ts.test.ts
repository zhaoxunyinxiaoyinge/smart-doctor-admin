import { describe, expect, it } from 'vitest';
import { parseUser, validateUser,nameSchema,b ,s} from './zod-ts';

describe('zod runtime validation', () => {
  it('validates a correct user', () => {
    const result = validateUser({
      id: 1,
      name: 'Alice',
      email: 'alice@example.com',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Alice');
      expect(result.data.id).toBe(1);
    }
  });

  it('rejects invalid user email', () => {
    const result = validateUser({
      id: 1,
      name: 'Alice',
      email: 'not-email',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['email']);
    }
  });

  it('throws on parseUser for invalid data', () => {
    expect(() => parseUser({
      id: 1,
      name: 'Alice',
      email: 'not-email',
    })).toThrow();
  });

  it("validates nameSchema correctly", () => {
    const result = nameSchema.safeParse({
      username: "testuser",
      id: 123
    })
    expect(result.success).toBe(true);
  });

  it("coerces string to number using b schema", () => {
      const result=b.safeParse("42");
      expect(result.success).toBe(true);
  })

  it("expects coercion to fail for invalid input", () => {
    const result=s.safeParse("not-hello");
    // z.prettifyError(result.error);
    console.log(result.error);
    expect(result.success).toBe(false);
  })
})

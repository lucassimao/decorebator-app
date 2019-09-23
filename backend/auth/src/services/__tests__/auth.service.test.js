const authService = require("../auth.service");
const UserDao = require("../../dao/user.dao");
const { db } = require("decorebator-common");

describe("Auth service tests", () => {
  beforeAll(async () => {
    await db.connect();
  });

  beforeEach(async () => {
    await UserDao.deleteMany({});
  });

  afterAll(async () => {
    await db.disconnect();
  });

  test("Should create a new user", async () => {
    await authService.register("USER1", "BR", "test@gmail.com", "12345");

    const count = await UserDao.countDocuments().exec();
    expect(count).toBe(1);
  });

  test("should generate a JWT token for valid credential", async () => {
    await authService.register("USER1", "BR", "test@gmail.com", "12345");

    const token = await authService.doLogin("test@gmail.com", "12345");
    expect(token).not.toBeNull();
  });

  test("should generate a error for invalid credential", async () => {
    try {
      await authService.doLogin("inexisting@gmail.com", "12345");
      expect(true).toBeFalsy();
    } catch (error) {
      expect(true).toBeTruthy();
    }
  });

  test("should remove user account", async () => {
    let count = await UserDao.countDocuments().exec();
    expect(count).toBe(0);

    await authService.register("USER1","US","test@gmail.com", "12345");

    count = await UserDao.countDocuments().exec();
    expect(count).toBe(1);

    await authService.removeAccount("test@gmail.com");

    count = await UserDao.countDocuments().exec();
    expect(count).toBe(0);
  });
});

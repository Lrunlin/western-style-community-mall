const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const router = new Router();
const id = require("@/utils/id");

// 创建用户地址接口
router.post("/address", auth(), async ctx => {
  try {
    // 获取用户ID，你的认证模块可能提供了用户信息
    const userId = ctx.id;
    // 从请求体中获取地址相关信息，根据实际情况修改字段名
    const { name, phone, address, isDefault } = ctx.request.body;
    // 如果新地址的 isDefault 为 true，先将用户其他地址的 isDefault 修改为 false
    if (isDefault) {
      await db.query(`
        UPDATE address
        SET isDefault = false
        WHERE user_id = ${userId} AND isDefault = true;
      `);
    }
    // 插入新地址信息
    const result = await db.query(`
      INSERT INTO address (id,user_id, name, phone, address, isDefault)
      VALUES (${id()},${userId}, '${name}', '${phone}', '${address}', ${isDefault ? 1 : 0});
    `);

    ctx.body = {
      success: true,
      message: "用户地址创建成功",
      data: result,
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "创建用户地址失败",
      error: error.message,
    };
  }
});

module.exports = router;

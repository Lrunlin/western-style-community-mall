const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const router = new Router();

// 查询用户地址接口
router.get("/address", auth(), async ctx => {
  try {
    // 使用用户ID查询地址信息
    const [result] = await db.query(`
      SELECT * FROM address WHERE user_id = ${ctx.id} and state=1 order by isDefault desc;
    `);

    ctx.body = {
      success: true,
      data: result.map(item => ({ ...item, isDefault: !!item.isDefault })),
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "查询用户地址失败",
      error: error.message,
    };
  }
});

module.exports = router;

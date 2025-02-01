const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const router = new Router();

// 根据地址ID查询用户地址接口
router.get("/address/:id", auth(), async ctx => {
  try {
    // 使用用户ID查询地址信息
    const [result] = await db.query(
      `
      SELECT * FROM address WHERE user_id = ${ctx.id} and state=1 and id=? order by isDefault desc;
    `,
      [ctx.params.id]
    );

    if (result.length) {
      result[0].isDefault = !!result[0].isDefault;
    }

    ctx.body = {
      success: true,
      data: result[0],
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

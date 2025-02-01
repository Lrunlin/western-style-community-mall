const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const router = new Router();

router.get("/commodity/recommend/list", auth(), async ctx => {
  try {
    const [result] = await db.query(`SELECT * FROM commodity where state=1 and inventory>0`);

    ctx.body = {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "查询失败",
      error: error.message,
    };
  }
});

module.exports = router;

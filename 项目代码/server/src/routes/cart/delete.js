const Router = require("koa-router");
const db = require("@/db");
const router = new Router();
const auth = require("@/modules/auth");
const qs = require("qs");

router.delete("/cart", auth(), async ctx => {
  try {
  const cartIds = qs.parse(ctx.request.query).id; //数组

  if (!cartIds || !Array.isArray(cartIds) || cartIds.length === 0) {
    ctx.body = {
      success: false,
      message: "参数需要是数组",
    };
    return;
  }
  const query = "DELETE FROM cart WHERE id IN (?)";
  const [result] = await db.query(query, [cartIds]);

  ctx.body = {
    success: true,
    message: `删除成功`,
  };
  } catch (error) {
    console.log(error);
    ctx.body = {
      success: false,
      message: "删除错误s",
      error: error.message,
    };
  }
});

module.exports = router;

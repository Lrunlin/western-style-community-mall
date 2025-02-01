const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const router = new Router();

router.put("/order/logistics/:id", auth(), async ctx => {
  try {
    const { id } = ctx.params;
    const { logistics_number } = ctx.request.body;

    // 更新订单的物流单号
    const updateQuery = `
      UPDATE orders
      SET logistics_number = ?
      WHERE id = ?
    `;
    await db.query(updateQuery, [logistics_number, id]);

    ctx.body = {
      success: true,
      message: "成功更新物流单号",
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "更新物流单号失败",
    };
  }
});

module.exports = router;

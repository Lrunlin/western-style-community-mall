const Router = require("koa-router");
const db = require("@/db");
const router = new Router();
const auth = require("@/modules/auth");

setInterval(async () => {
  try {
    // 获取当前时间
    const currentTime = new Date();
    // 计算30天之前的时间
    const thirtyDaysAgo = new Date(currentTime.getTime() - 30 * 24 * 60 * 60 * 1000);

    // 更新订单状态为2（已完成），创建时间超过30天的订单
    const updateQuery = `
      UPDATE orders  SET state = 2  WHERE create_time < ? and state!=2
    `;
    await db.query(updateQuery, [thirtyDaysAgo]);
    console.log("定时任务执行成功：已将创建超过30天的订单状态修改为2");
  } catch (error) {
    console.error("定时任务执行失败：", error);
  }
}, 60 * 60 * 1000);

router.put("/order/finish/:id", auth(), async ctx => {
  try {
    const orderId = ctx.params.id; // 获取订单ID

    // 更新订单状态为已完成
    const updateQuery = `
      UPDATE orders
      SET state = 2
      WHERE id = ${orderId}
    `;
    await db.query(updateQuery);

    ctx.body = {
      success: true,
      message: "已收货",
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "更新订单状态失败",
      error: error.message,
    };
  }
});

module.exports = router;

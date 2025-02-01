const Router = require("koa-router");
const db = require("@/db");
const router = new Router();
const id = require("@/utils/id");
const auth = require("@/modules/auth");

router.post("/evaluate/:orderId", auth(), async ctx => {
  try {
    const orderId = ctx.params.orderId;
    const { comment } = ctx.request.body;

    const [orderResult] = await db.query(`SELECT * FROM orders WHERE id = ? and is_reviewed=0`, [
      orderId,
    ]);
    if (orderResult.length === 0) {
      ctx.body = {
        success: false,
        message: "订单不存在",
      };
      return;
    }

    await Promise.all(
      comment.map(async item => {
        await db.query(
          `INSERT INTO evaluate (id,content, user_id, commodity_id, create_time, score,order_id) VALUES (?,?, ?, ?, NOW(), ?,?)`,
          [id(), item.message || "", ctx.id, item.commodity_id, item.score, orderId]
        );
      })
    );

    ctx.body = {
      success: true,
      message: "评论添加成功",
    };

    await db.query(`UPDATE orders SET is_reviewed = true WHERE id = ?`, [orderId]);
  } catch (error) {
    console.log(error);
    ctx.body = {
      success: false,
      message: "添加评论失败",
      error: error.message,
    };
  }
});

module.exports = router;

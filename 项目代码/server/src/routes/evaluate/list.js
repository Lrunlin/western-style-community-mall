const Router = require("koa-router");
const db = require("@/db");
const router = new Router();

router.get("/evaluate/:commodity_id", async ctx => {
  try {
    const commodity_id = ctx.params.commodity_id;

    // 查询商品的全部评论并关联用户信息
    const [result] = await db.query(
      `
      SELECT 
        evaluate.id AS evaluate_id,
        evaluate.content,
        evaluate.score,
        evaluate.create_time,
        user.id AS user_id,
        user.name AS user_name,
        user.avatar AS user_avatar
      FROM 
        evaluate
      INNER JOIN
        user ON evaluate.user_id = user.id
      WHERE 
        evaluate.commodity_id = ?
      ORDER BY 
        evaluate.create_time DESC
    `,
      [commodity_id]
    );

    ctx.body = {
      success: true,
      data: result,
    };
  } catch (error) {
    ctx.body = {
      success: false,
      message: "查询评论失败",
      error: error.message,
    };
  }
});

module.exports = router;

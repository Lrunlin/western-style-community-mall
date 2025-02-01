const Router = require("koa-router");
const db = require("@/db");
const router = new Router();

router.get("/article/:id", async ctx => {
  const [article] = await db.query(
    `SELECT
  *
FROM
  article where id=? and state=1;
`,
    [ctx.params.id]
  );

  if (article.length) {
    if (article[0].commodity_id) {
      // 如果存在商品 ID，则联表查询商品信息
      const [commodity] = await db.query(`SELECT * FROM commodity WHERE id = ?`, [
        article[0].commodity_id,
      ]);
      article[0].commodity_data = commodity[0];
    }

    if (article[0].user_id == 0) {
      // 如果 user_id 是 0，则添加管理员信息
      article[0].admin_data = { name: "管理员" };
    } else {
      // 否则，将用户信息添加到文章数据中
      article[0].user_data = {
        id: article[0].user_id,
        name: article[0].user_name,
        email: article[0].email,
        avatar: article[0].avatar,
      };
    }
  }

  ctx.body = {
    success: !!article.length,
    data: article[0],
  };
});

module.exports = router;

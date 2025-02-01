const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const router = new Router();

router.put("/commodity/:id", auth(), async ctx => {
  try {
    const commodityId = ctx.params.id;
    const { name, description, cover, banner, price, configuration, inventory } = ctx.request.body;

    // 构建 SQL 更新语句
    const updateQuery = `
      UPDATE commodity 
      SET 
        name = ?,
        description = ?,
        cover = ?,
        banner = ?,
        price = ?,
        configuration = ?,
        inventory = ?
      WHERE id = ?
    `;

    // 执行数据库更新操作
    const result = await db.query(updateQuery, [
      name,
      description,
      cover,
      JSON.stringify(banner),
      price,
      JSON.stringify(configuration),
      inventory,
      commodityId,
    ]);

    ctx.body = {
      success: !!result[0]?.affectedRows,
      message: "更新成功",
    };
  } catch (error) {
    console.log(error);
    ctx.body = {
      success: false,
      error: error.message,
      message: "更新失败",
    };
  }
});

module.exports = router;

const Router = require("koa-router");
const db = require("@/db");
const router = new Router();

router.put("/cart/:id", async ctx => {
  try {
    const cartId = ctx.params.id;
    const { type } = ctx.request.body;

    if (type !== "add" && type !== "less") {
      ctx.body = {
        success: false,
        message: "未知的操作类型",
      };
      return;
    }

    let updateQuery = "";
    let affectedRows = 0;

    if (type === "add") {
      updateQuery = "UPDATE cart SET count = count + 1 WHERE id = ?";
    } else if (type === "less") {
      const [cartResult] = await db.query("SELECT count FROM cart WHERE id = ?", [cartId]);
      const currentCount = cartResult[0].count;

      if (currentCount > 1) {
        updateQuery = "UPDATE cart SET count = count - 1 WHERE id = ?";
      } else {
        updateQuery = "DELETE FROM cart WHERE id = ?";
      }
    }

    const [result] = await db.query(updateQuery, [cartId]);
    affectedRows = result.affectedRows;

    if (affectedRows === 0) {
      ctx.body = {
        success: false,
        message: "购物车商品未找到",
      };
      return;
    }

    ctx.body = {
      success: true,
      message: "购物车商品已成功更新",
    };
  } catch (error) {
    ctx.body = {
      success: false,
      message: "更新购物车商品时出错",
      error: error.message,
    };
  }
});

module.exports = router;

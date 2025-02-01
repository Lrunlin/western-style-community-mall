const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const id = require("@/utils/id");
const router = new Router();

// 加入购物车接口
router.post("/cart", auth(), async ctx => {
  try {
    const user_id = ctx.id; // 从认证中间件中获取用户ID
    const commodity_id = ctx.request.body.commodity_id;

    // 先检查购物车中是否已经存在该商品，存在则更新数量，否则插入新记录
    const [existingCart] = await db.query(
      `
      SELECT * FROM cart WHERE user_id = ? AND commodity_id = ?;
    `,
      [user_id, commodity_id]
    );

    let existingCartItem = existingCart[0];

    if (existingCartItem) {
      // 如果购物车已存在该商品，则更新数量
      await db.query(
        `
        UPDATE cart SET count = ? WHERE user_id = ? AND commodity_id = ?;
      `,
        [existingCartItem.count + 1, user_id, commodity_id]
      );
    } else {
      // 如果购物车中不存在该商品，则插入新记录
      await db.query(
        `
        INSERT INTO cart (id,user_id, commodity_id, count, create_time)
        VALUES (?,?, ?, 1, NOW());
      `,
        [id(), user_id, commodity_id]
      );
    }

    ctx.body = {
      success: true,
      message: "商品成功加入购物车",
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "加入购物车失败",
      error: error.message,
    };
  }
});

module.exports = router;

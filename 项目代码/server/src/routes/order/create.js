const Router = require("koa-router");
const db = require("@/db");
const id = require("@/utils/id");
const auth = require("@/modules/auth");
const router = new Router();

router.post("/order", auth(), async ctx => {
  try {
    const { commodity_data, payment, address_id, notes } = ctx.request.body;
    let user_id = ctx.id;
    // 查询商品信息
    const [commodityQuery] = await db.query("SELECT * FROM commodity WHERE id in (?)", [
      commodity_data.map(item => item.id),
    ]);

    if (!commodityQuery?.length) {
      ctx.body = {
        success: false,
        message: "未找到对应的商品信息",
      };
      return;
    }

    // if (commodityQuery.some(item => item.inventory <= 0 || item.state != 1)) {
    //   ctx.body = {
    //     success: false,
    //     message: "部分商品库存不足或未发售",
    //   };
    //   return;
    // }

    if (
      commodityQuery.some(
        item =>
          item.inventory < commodity_data.find(el => el.id == item.id).count || item.state != 1
      )
    ) {
      ctx.body = {
        success: false,
        message: "部分商品库存不足",
      };
      return;
    }

    // 构建订单数据
    const orderData = {
      id: id(),
      user_id: user_id,
      commodity_data: JSON.stringify(
        commodityQuery.map(item => {
          return { ...item, count: commodity_data.find(_item => _item.id == item.id).count || 1 };
        })
      ),
      payment_method: `${payment}:${id()}`,
      address_id: address_id,
      notes: notes,
      create_time: new Date(),
    };

    // 插入订单到数据库
    const result = await db.query(
      "INSERT INTO orders (id, user_id,  commodity_data,  payment_method, notes,address_id, create_time) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        orderData.id,
        orderData.user_id,
        orderData.commodity_data,
        orderData.payment_method,
        orderData.notes,
        orderData.address_id,
        orderData.create_time,
      ]
    );

    ctx.body = {
      success: !!result[0]?.affectedRows,
      message: "订单添加成功",
    };

    // 商品库存-1
    // db.query(
    //   `UPDATE commodity
    // SET inventory = inventory - 1
    // WHERE id in (?);
    // `,
    //   [commodity_data.map(item => item.id)]
    // );

    for (let index = 0; index < commodity_data.length; index++) {
      const item = commodity_data[index];
      db.query(
        `UPDATE commodity
    SET inventory = inventory - ${item.count}
    WHERE id=${item.id};
    `
      );
    }

    // 如果是购物车商品就删除对应的购物车

    if (ctx.request.body.cart_id) {
      await db.query(`DELETE FROM cart WHERE id in (?)`, [ctx.request.body.cart_id]);
    }
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "订单添加失败",
      error: error.message,
    };
  }
});

module.exports = router;

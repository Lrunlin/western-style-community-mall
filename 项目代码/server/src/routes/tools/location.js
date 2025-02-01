const Router = require("koa-router");
const axios = require("axios");

function getClientIP(req) {
  let ip =
    req.headers["x-forwarded-for"] ||
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress ||
    "";
  if (ip) {
    ip = ip.replace("::ffff:", "");
  }
  return ip;
}

let router = new Router();

router.get("/location", async ctx => {
  try {
    const response = await axios.get("https://api.map.baidu.com/location/ip", {
      params: {
        coor: "bd09ll",
        ak: `E1xIzplbXNHbqehCW36mGK5oiDPec4Mq`,
        ip: getClientIP(ctx.req),
      },
    });
    const address_detail = response.data?.content?.address_detail;

    ctx.body = {
      success: true,
      message: "查询成功",
      data: { city: address_detail.city || null, province: address_detail.province || null },
    };
  } catch (error) {
    ctx.body = {
      success: true,
      message: "查询成功",
      data: { city: "大连市", province: "辽宁省" },
    };
  }
});

module.exports = router;

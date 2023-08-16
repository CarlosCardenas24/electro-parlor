/*
  The custom REST API to support the app frontend.
  Handlers combine application data from qr-codes-db.js with helpers to merge the Shopify GraphQL Admin API data.
  The Shop is the Shop that the current user belongs to. For example, the shop that is using the app.
  This information is retrieved from the Authorization header, which is decoded from the request.
  The authorization header is added by App Bridge in the frontend code.
*/

import express from "express";

import shopify from "../shopify.js";
import { QRCodesDB } from "../qr-codes-db.js";
import {
  getQrCodeOr404,
  getShopUrlFromSession,
  parseQrCodeBody,
  formatQrCodeResponse,
} from "../helpers/qr-codes.js";

const SHOP_DATA_QUERY = `
  query shopData($first: Int!) {
    shop {
      url
    }
    codeDiscountNodes(first: $first) {
      edges {
        node {
          id
          codeDiscount {
            ... on DiscountCodeBasic {
              codes(first: 1) {
                edges {
                  node {
                    code
                  }
                }
              }
            }
            ... on DiscountCodeBxgy {
              codes(first: 1) {
                edges {
                  node {
                    code
                  }
                }
              }
            }
            ... on DiscountCodeFreeShipping {
              codes(first: 1) {
                edges {
                  node {
                    code
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// setup a method, decide how to unpack, decide how to get it in the db
// get a branch, git add ., git commit, git push, 

export default function applyQrCodeApiEndpoints(app) {
  app.use(express.json());

  app.get("/api/shop-data", async (req, res) => {
    const client = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session,
    });

    /* Fetch shop data, including all available discounts to list in the QR code form */
    const shopData = await client.query({
      data: {
        query: SHOP_DATA_QUERY,
        variables: {
          first: 25,
        },
      },
    });

    res.send(shopData.body.data);
  });

  app.get("/api/auth?shop=electro-parlor.myshopify.com")

  app.post("/api/qrcodes", async (req, res) => {
    try {
      const id = await QRCodesDB.create({
        ...(await parseQrCodeBody(req)),

        /* Get the shop from the authorization header to prevent users from spoofing the data */
        shopDomain: await getShopUrlFromSession(req, res),
      });
      const response = await formatQrCodeResponse(req, res, [
        await QRCodesDB.read(id),
      ]);
      res.status(201).send(response[0]);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.patch("/api/qrcodes/:id", async (req, res) => {
    const qrcode = await getQrCodeOr404(req, res);

    if (qrcode) {
      try {
        await QRCodesDB.update(req.params.id, await parseQrCodeBody(req));
        const response = await formatQrCodeResponse(req, res, [
          await QRCodesDB.read(req.params.id),
        ]);
        res.status(200).send(response[0]);
      } catch (error) {
        res.status(500).send(error.message);
      }
    }
  });

  app.get("/api/qrcodes", async (req, res) => {
    try {
      const rawCodeData = await QRCodesDB.list(
        await getShopUrlFromSession(req, res)
      );

      const qrCodeLoyaltyPoints = await QRCodesDB.listLoyaltyPoints();
      const qrCodes = await formatQrCodeResponse(req, res, rawCodeData);
      
      res.status(200).send(/* {qrCodes, qrCodeLoyaltyPoints} */ qrCodes + qrCodeLoyaltyPoints);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  });

  app.get("/api/qrcodes/:id", async (req, res) => {
    const qrcode = await getQrCodeOr404(req, res);

    if (qrcode) {
      const formattedQrCode = await formatQrCodeResponse(req, res, [qrcode]);
      res.status(200).send(formattedQrCode[0]);
    }
  });

  app.delete("/api/qrcodes/:id", async (req, res) => {
    const qrcode = await getQrCodeOr404(req, res);

    if (qrcode) {
      await QRCodesDB.delete(req.params.id);
      res.status(200).send();
    }
  });

  // Start of customer points ---------------------------------------------------------
  app.post("/api/loyaltypoints", async (req, res) => {
    try {
      const initResponse = await QRCodesDB.initLoyaltyPoints()
      const createResponse = await QRCodesDB.createLoyaltyPoints(req.body)

      return res.status(201).send({
        message: "Points saved"
      });
    } catch (error) {
      return res.status(500).send(error.message)
    }
  });

  /* app.get("/api/loyaltypoints", async (req, res) => {
    try {
      const qrCodeLoyaltyPoints = await QRCodesDB.listLoyaltyPoints();
      
      res.status(200).send(qrCodeLoyaltyPoints);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  }); */

  app.put("/api/loyaltypoints/:id", async (req, res) => {
    const {id} = req.params
    const {loyaltyPoints} = req.body

      try {
        const response = await QRCodesDB.updateLoyaltyPoints(id, loyaltyPoints);
        res.status(200).send({response, messag: `Qr Code with id of: ${id} has been updated ${loyaltyPoints} points`});
      } catch (error) {
        res.status(502).send(error.message);
      }
  });

  app.delete("/api/loyaltypoints/:id", async (req, res) => {
    const {id} = req.params

    try {
      const response = await QRCodesDB.deleteLoyaltyPoints(id)
      res.status(200).send({response, message: `Qr Code with id of: ${id} has been deleted`})
    } catch (error) {

    }
  })

}
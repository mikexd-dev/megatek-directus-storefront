import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import Mailjet from "node-mailjet";

const MJ_APIKEY_PUBLIC = process.env.MJ_APIKEY_PUBLIC || "";
const MJ_APIKEY_PRIVATE = process.env.MJ_APIKEY_PRIVATE || "";

const MJ_API_TOKEN = "your API token";

const mailjet = Mailjet.apiConnect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE, {
  config: {},
  options: {},
});
const uri =
  "mongodb://admin:password123!@cluster0-shard-00-00.f9ncm.gcp.mongodb.net:27017,cluster0-shard-00-01.f9ncm.gcp.mongodb.net:27017,cluster0-shard-00-02.f9ncm.gcp.mongodb.net:27017/megatek?ssl=true&replicaSet=atlas-tp8q5u-shard-0&authSource=admin&retryWrites=true&w=majority";

const rfqSchema = new mongoose.Schema({
  id: String,
  product: String,
  quantity: Number,
  email: String,
  timestamp: String,
});

async function getLatest(RFQ: any) {
  try {
    const latestDocument = await RFQ.findOne().sort({ _id: -1 }).exec();
    return latestDocument;
  } catch (error) {
    console.error("Error fetching the latest document:", error);
    throw error; // Rethrow or handle as needed
  }
}

const saveRFQId = async (body: any) => {
  try {
    // compile schema to model
    let RFQ;
    try {
      RFQ = mongoose.model("RFQ");
    } catch (error) {
      RFQ = mongoose.model("RFQ", rfqSchema);
    }

    // Connect to the MongoDB cluster
    mongoose.connect(uri, {
      //   useUnifiedTopology: true,
      //   useNewUrlParser: true,
    });
    const db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error:"));
    console.log("Connection Successful!");

    // console.log("hello");
    const latest = await getLatest(RFQ);
    console.log(latest, "latest");
    let rfq1, rfq_id;
    // a document instance

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    //@ts-ignore
    today = yyyy + mm + dd;
    let newid = 1;
    if (latest) {
      newid = parseInt(
        latest.id.slice(latest.id.indexOf("-") + 1, latest.id.length)
      );
      newid += 1;
    }

    // console.log(newid, "new id");
    rfq_id = "RFQ" + today + "-" + newid;
    rfq1 = new RFQ({
      id: rfq_id,
      product: body.name,
      quantity: body.quantity,
      serialNum: body.serialNum,
      email: body.email,
    });

    // save model to database
    // @ts-ignore
    const data = await rfq1.save();
    console.log(`${data} saved to rfq collection.`);

    const result1 = await emailMegatek(body, data.id);
    const result2 = await emailCustomer(body, data.id);

    return { result: "email sent" };
  } catch (e) {
    console.error(e);
  }
};

async function emailCustomer(body: any, rfq_id: string) {
  let htmlString2 = `<p>Hi ${body.name},<br/><br/>Thank you for your inquiry on our products. <br/> This is a confirmation email regarding [<b>${body.subject}</b>]. <br/>We have received your request and will get back to you soon. Below are the details of your request for your information: <br/><br/>`;

  //   for (var key in req.body.body.data[0].serialArray) {
  //     console.log(key, req.body.body.data[0].serialArray[key]);
  //     htmlString2 += `<b>${_.startCase(key.replace(/-/g, " "))}:</b> ${
  //       req.body.body.data[0].serialArray[key].name
  //     }<br/>`;
  //   }

  for (const key in body) {
    if (key.includes("Select")) {
      htmlString2 += `<b>${key.replace("Select", "")}:</b> ${body[key]}<br/>`;
    }
  }
  htmlString2 += `<br/><br/><b>Quantity:</b> ${body.quantity}<br/><b>RFQ ID:</b> ${rfq_id}<br/><br/>Please email us and quote the above RFQ ID should there be any changes to this RFQ.<br/> Thank you. <br/><br/> Best regards,<br/>Megatek Team</p>`;
  return mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "megatek.org@gmail.com",
          Name: "Megatek Admin",
        },
        To: [
          {
            Email: body.email,
            Name: body.name,
          },
        ],
        Subject: `[${rfq_id}]: ${body.subject} Confirmation`,
        TextPart: "",
        HTMLPart: htmlString2,
        CustomID: "Order Request Confirmation",
      },
    ],
  });
}

async function emailMegatek(body: any, rfq_id: any) {
  console.log(body, "hello");
  let htmlString = `<p>Hi Team,<br/> I would like to <b>${
    body.subject
  }</b>. <br/><br/><b>Requester Email:</b> ${
    body.email
  }<br/> <b>Requester Name:</b> ${body.name}<br/><b>Phone Number:</b> ${
    body.phone
  }<br/><b>Company:</b> ${
    body.company
  }<br/><br/><b>Message from requester:</b> <p style="width:300px">${
    body.message == "" ? "(No message)" : body.message
  }</p> <br/>RFQ ID:<b>${rfq_id}</b><br/>`;
  // htmlString += "<ul>";
  //   for (var key in req.body.body.data[0].serialArray) {
  //     console.log(key, req.body.body.data[0].serialArray[key]);
  //     htmlString += `<b>${_.startCase(key.replace(/-/g, " "))}:</b> ${
  //       req.body.body.data[0].serialArray[key].name
  //     }<br/>`;
  //   }
  htmlString += "<br/>";
  //   req.body.body.data.map((item) => {
  //     htmlString += `<b>Model:</b> ${item.name}<br/><b>Serial Number:</b> ${item.serialNum}<br/><b>Quantity:</b> ${item.quantity}<br/>`;
  //   });
  htmlString += `</ul><br/> Thank you. <br/> Best regards,<br/>${body.name}</p>`;
  return mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "megatek.org@gmail.com",
          Name: "Megatek Website",
        },
        To: [
          {
            Email: "megatek.management@gmail.com",
            Name: "Megatek",
          },
          //   {
          //     Email: "megatek.org@gmail.com",
          //     Name: "Megatek",
          //   },
          //   {
          //     Email: "sales@megatek.org",
          //     Name: "Megatek",
          //   },
        ],
        Subject: `[${rfq_id}]: ${body.subject}`,
        TextPart: body.message,
        HTMLPart: htmlString,
        CustomID: "Order Request",
      },
    ],
  });
}

export async function POST(request: NextRequest) {
  try {
    // Assuming JSON data is sent in the request body
    const data = await request.json();
    await saveRFQId(data);
    // Here you would typically handle the data, such as saving it to a database
    console.log(data); // Placeholder for actual data handling

    // Respond with a success message
    return NextResponse.json({ message: "Data received successfully" });
  } catch (error) {
    console.error("Error processing POST request:", error);
    // Respond with an error status code and message
    return NextResponse.json(
      { error: "Failed to process data" },
      { status: 500 }
    );
  }
}

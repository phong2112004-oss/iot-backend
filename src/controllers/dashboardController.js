import admin from 'firebase-admin';

export const updateSettings = async (req, res) => {
  try {
    const { 
      TEC_On_Threshold, 
      Tec_off, 
      Set_Frequency_Level1, 
      Set_Frequency_Level2, 
      Set_Frequency_Level3 
    } = req.body;

    if (TEC_On_Threshold === undefined || Tec_off === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields: TEC_On_Threshold and Tec_off are required." 
      });
    }

    const db = admin.database();
    const tempRef = db.ref('temp');

    await tempRef.update({
      TEC_On_Threshold: Number(TEC_On_Threshold),
      Tec_off: Number(Tec_off),
      Set_Frequency_Level1: Number(Set_Frequency_Level1),
      Set_Frequency_Level2: Number(Set_Frequency_Level2),
      Set_Frequency_Level3: Number(Set_Frequency_Level3)
    });

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully!"
    });

  } catch (error) {
    console.error("Error occurred in updateSettings:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message
    });
  }
};

export const updateMonitorButtons = async (req, res) => {
  try {
    const incomingUpdates = req.body;
    if (!incomingUpdates || Object.keys(incomingUpdates).length === 0) {
      return res.status(400).json({ success: false, message: "Không nhận được trường cập nhật nào!" });
    }

    const db = admin.database();
    const rootRef = db.ref();
    const updates = {};

    Object.keys(incomingUpdates).forEach((pathKey) => {
      updates[pathKey] = Number(incomingUpdates[pathKey]);
    });

    await rootRef.update(updates);

    return res.status(200).json({
      success: true,
      message: "All button and lamp states synchronized successfully!"
    });

  } catch (error) {
    console.error("Error in updateMonitorButtons:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error, unable to synchronize button and lamp states!",
      error: error.message
    });
  }
};
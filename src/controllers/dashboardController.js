import fetch from 'node-fetch';

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

    const updates = {
      TEC_On_Threshold: Number(TEC_On_Threshold),
      Tec_off: Number(Tec_off),
      Set_Frequency_Level1: Number(Set_Frequency_Level1),
      Set_Frequency_Level2: Number(Set_Frequency_Level2),
      Set_Frequency_Level3: Number(Set_Frequency_Level3)
    };

    const firebaseUrL = `https://ahuproject-b5139-default-rtdb.asia-southeast1.firebasedatabase.app/temp.json`;
    const response = await fetch(firebaseUrL, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    if (!response.ok) throw new Error(`Firebase REST Error: ${response.statusText}`);

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
      return res.status(400).json({ success: false, message: "No updates provided." });
    }

    const updates = {};
    Object.keys(incomingUpdates).forEach((pathKey) => {
      updates[pathKey] = Number(incomingUpdates[pathKey]);
    });

    const firebaseUrL = `https://ahuproject-b5139-default-rtdb.asia-southeast1.firebasedatabase.app/.json`;
    const response = await fetch(firebaseUrL, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    if (!response.ok) throw new Error(`Firebase REST Error: ${response.statusText}`);

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
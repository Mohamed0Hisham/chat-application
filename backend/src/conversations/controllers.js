import validator from "validator";

export const createConversation = async (req, res) => {
	try {
		const { participants } = req.body;
		for (const userID of participants) {
			if (validator.isMongoId(userID) == false) {
				return res.status(400).json({
					success: false,
					message: "invalid operation",
				});
			}
		}
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
export const fetchConversation = async (req, res) => {};
export const fetchUserConversations = async (req, res) => {};
export const updateConversationSetting = async (req, res) => {};
export const deleteConversation = async (req, res) => {};

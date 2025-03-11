import User from "../users/models.js";
export const fetchRequets = async (req, res) => {
	try {
		const user = req.user;

		const result = await User.findById(user._id, {
			requests: 1,
			_id: 0,
		})
			.populate("requests")
			.lean();
		console.log(result);

		return res.status(200).json({
			success: true,
			message: "requests fetched",
			requests: result,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

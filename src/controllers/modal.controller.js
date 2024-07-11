import Component from "../controllers/components.controller.js";

const get_title = async (req, res) => {
	const { title, description, path } = req.query;

	res.render("../views/components/modal/preview", {
		title: title,
		description: description,
	});
};

export default {
	get_title,
};

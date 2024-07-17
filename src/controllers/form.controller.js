import { Component } from "../models/component.model.js";
import FormComponent from "../objects/component.js";
import FormObject from "../objects/form.js";
import Form from "../models/form.models.js";

const index = async (req, res) => {
  /**
   *  index page
   * route "/" get
   */
  res.render("index");
};

const getCreatePage = async (req, res) => {
  /**
   *
   * Handles the creation of a form.
   * route "/create" get
   */
  res.render("pages/create");
};

const submit = async (req, res) => {
  /**
   * Handles the submission of a form.
   * route "/create" post
   *
   */
  if (req.isUnauthenticated()) return res.status(401).send("Unauthorized");
  try {
    const formData = req.body;

    const components = [];
    formData.formComponents.forEach((component) => {
      const formComponent = new FormComponent(component);
      console.log("formComponent", formComponent);
      const newComponent = new Component(formComponent.toCreateFormModel());
      components.push(newComponent);
    });

    const form = new FormObject({
      user_id: req.user._id,
      name: formData.formName,
      description: formData.formDescription,
      components: components,
    });
    
    await new Form(form.toCreateFormModel()).save();
    console.log("ADDED TO DB", JSON.stringify(form));
    return res.json({ form });
  } catch (error) {
    console.error("Error processing form:", error);
    return res.status(500).send(error);
  }
};

const list = async (req, res) => {
  /**
   * Retrieves a list of forms for a specific user.
   * route "/forms" get
   */
  const allForms = await Form.find({ user_id: req.user.id });

  const forms = allForms.map((form) => {
    return {
      id: form._id,
      name: form.name,
      description: form.description,
      date: form.createdAt.toISOString().split("T")[0],
    };
  });
  res.render("pages/listform", { forms });
};

//route "/forms/:id" get
const viewForm = async (req, res) => {
  const form_id = req.params.id;
  console.log("form ID: ", form_id);
  try {
    const form = await Form.findById(form_id);
    console.log(form.toJSON());

    res.render("pages/viewform", { form: form.toJSON() });
  } catch (error) {
    console.error("Error retrieving form:", error);
    res.status(500).send("Error retrieving form");
  }
};

const editForm = async (req, res) => {
  /**
   * Handles the submission of a form.
   * route "/forms/:id/edit" post
   */
  const form_id = req.params.id;
  const form = Form.findById(form_id);

  if (
    (form.authorized_email || form.user_id == req.user._id) &&
    form.authorized_email.includes(req.user.email) &&
    !form.is_active
  ) {
    res.render("pages/editform");
  } else {
    res.redirect(`/form/${form_id}`);
  }
};

const updateForm = async (req, res) => {
  /**
   * Handles the edit made in the form
   * /forms/:id/edit post
   */
  res.send(200, "Form updated");
};

const deleteForm = async (req, res) => {
  //route "/delete/:form_id" delete
  const { form_id } = req.params;
  try {
    const deleteForm = await Form.deleteOne({ _id: form_id });
    if (deleteForm) {
      console.log("Form deleted:", deleteForm);
      res.status(200).send(deleteForm);
    } else {
      res.status(404).send("Form not found");
    }
  } catch (error) {
    console.error("Error deleting form:", error);
    res.status(500).send("Error deleting form");
  }
};

const deleteAllForms = async (req, res) => {
  // route "/deleteAll"
  try {
    await Form.deleteMany({});
    res.status(200).send("All forms deleted");
  } catch (error) {
    console.error("Error deleting forms:", error);
    res.status(500).send("Error deleting forms");
  }
};

//preview
const preview = async (req, res) => {
 res.render(`pages/preview`);
};

export default {
  index,
  getCreatePage,
  submit,
  list,
  editForm,
  viewForm,
  updateForm,
  preview,
  deleteAllForms,
  deleteForm,
};

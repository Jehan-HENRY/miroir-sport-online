import React, { Component } from "react";
import $ from "jquery";
import {
  Grid,
  Container,
  Form,
  Button,
  Message,
  Icon,
  Modal,
  Header
} from "semantic-ui-react";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import pdfMake from "pdfmake/build/pdfmake";
import vfsFonts from "pdfmake/build/vfs_fonts";
import background from "../img/background.jpg";
import footer from "../img/footer.jpg";
import logo from "../img/logo.jpg";

class EntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      toggleEdit: false,
      toggleModal: false,

      reference: "",
      product: "",
      description: "",
      characteristics: "",
      dimensions: "",
      photos: "",
      schemas: "",
      date: "",
      update: "-",

      background: "",
      footer: "",
      logo: ""
    };
    this.deleteEverything = this.deleteEverything.bind(this);
    this.handlePhotoSelect = this.handlePhotoSelect.bind(this);
    this.handleSchemaSelect = this.handleSchemaSelect.bind(this);
    this.notificationCheck = this.notificationCheck.bind(this);
  }

  deleteEverything() {
    this.setState({
      reference: "",
      product: "",
      description: "",
      characteristics: "",
      dimensions: "",
      toggleModal: !this.state.toggleModal
    });
    $("span").html("");
    NotificationManager.info("C'est nettoyé, tu peux recommencer !");
  }

  getDataUri(url, callback) {
    var image = new Image();
    image.onload = function() {
      var canvas = document.createElement("canvas");
      canvas.width = this.naturalWidth;
      canvas.height = this.naturalHeight;
      canvas.getContext("2d").drawImage(this, 0, 0);
      callback(canvas.toDataURL("image/jpeg"));
    };
    for (let property in url) {
      image.src = url[property];
    }
  }

  componentDidMount() {
    this.getDataUri({ background }, dataUri => {
      this.setState({
        background: dataUri
      });
    });
    this.getDataUri({ footer }, dataUri => {
      this.setState({
        footer: dataUri
      });
    });
    this.getDataUri({ logo }, dataUri => {
      this.setState({
        logo: dataUri
      });
    });

    document
      .getElementById("photos")
      .addEventListener("change", this.handlePhotoSelect, false);
    document
      .getElementById("schemas")
      .addEventListener("change", this.handleSchemaSelect, false);

    var now = new Date();
    var day = now.getDate();
    var month = now.getMonth() + 1;
    var year = now.getFullYear();
    var date = day + "/" + month + "/" + year;
    this.setState({
      date: date
    });
  }

  handlePhotoSelect(evt) {
    var photos = evt.target.files;
    for (var i = 0, f; (f = photos[i]); i++) {
      if (!f.type.match("image.*")) {
        continue;
      }
      var reader = new FileReader();
      reader.onload = (theFile => {
        return e => {
          var span = document.createElement("span");
          span.innerHTML = [
            "<span>",
            '<img class="thumb" src="',
            e.target.result,
            '" title="',
            escape(theFile.name),
            '"/>',
            '<a id="deletePhoto" class="delete">&times;</a>',
            "</span>",
            "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
          ].join("");
          span.setAttribute("id", "photo");
          document.getElementById("listPhotos").insertBefore(span, null);
          this.setState({
            photos: [...this.state.photos, e.target.result]
          });
        };
      })(f);
      reader.readAsDataURL(f);
    }
  }

  handleSchemaSelect(evt) {
    var schemas = evt.target.files;
    for (var i = 0, f; (f = schemas[i]); i++) {
      if (!f.type.match("image.*")) {
        continue;
      }
      var reader = new FileReader();
      reader.onload = (theFile => {
        return e => {
          var span = document.createElement("span");
          span.innerHTML = [
            "<span>",
            '<img class="thumb" src="',
            e.target.result,
            '" title="',
            escape(theFile.name),
            '"/>',
            '<a id="deleteSchema" class="delete">&times;</a>',
            "</span>",
            "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
          ].join("");
          span.setAttribute("id", "schema");
          document.getElementById("listSchemas").insertBefore(span, null);
          this.setState({
            schemas: [...this.state.schemas, e.target.result]
          });
        };
      })(f);
      reader.readAsDataURL(f);
    }
  }

  notificationCheck() {
    let reference = false;
    let product = false;
    let description = false;
    let characteristics = false;
    let dimensions = false;
    let photos = false;
    let schemas = false;

    if (this.state.reference !== "") {
      reference = true;
    } else {
      NotificationManager.warning("Il manque la référence !", "Attention");
    }
    if (this.state.product !== "") {
      product = true;
    } else {
      NotificationManager.warning("Il manque le produit !", "Attention");
    }
    if (this.state.description !== "") {
      description = true;
    } else {
      NotificationManager.warning("Il manque la description !", "Attention");
    }
    if (this.state.characteristics !== "") {
      characteristics = true;
    } else {
      NotificationManager.warning(
        "Il manque les caractéristiques !",
        "Attention"
      );
    }
    if (this.state.dimensions !== "") {
      dimensions = true;
    } else {
      NotificationManager.warning("Il manque les dimensions !", "Attention");
    }
    if (this.state.photos !== "") {
      photos = true;
    } else {
      NotificationManager.warning("Il manque la photo !", "Attention");
    }
    if (this.state.schemas !== "") {
      schemas = true;
    } else {
      NotificationManager.warning("Il manque le schéma !", "Attention");
    }
    if (
      reference === true &&
      product === true &&
      description === true &&
      characteristics === true &&
      dimensions === true &&
      photos === true &&
      schemas === true
    ) {
      if (this.state.checked === false) {
        NotificationManager.success("On peut y aller !", "Parfait");
        NotificationManager.info(
          "Si tu veux de nouveau modifier les champs, il faut décocher.",
          "Info",
          10000
        );
      }
      this.setState({
        toggleEdit: !this.state.toggleEdit,
        checked: !this.state.checked
      });
    }
  }

  render() {
    $("#checkbox").change(function() {
      $("#photosUpload").toggleClass("disabled", this.checked);
      $("#schemasUpload").toggleClass("disabled", this.checked);
      $("#photo").attr("id", "disabledPhoto");
      $("#schema").attr("id", "disabledSchema");
    });
    $("#deletePhoto").click(function() {
      $("#photo").html("");
    });
    $("#deleteSchema").click(function() {
      $("#schema").html("");
    });

    // console.log(this);
    const { vfs } = vfsFonts.pdfMake;
    pdfMake.vfs = vfs;

    var docDefinition = {
      info: {
        title: this.state.product,
        author: "Romain Bonnefoy",
        subject: "Fiche Technique",
        creator: "Romain Bonnefoy",
        producer: "Romain Bonnefoy",
        CreationDate: new Date()
      },
      pageMargins: [50, 120, 50, 75],
      background: {
        image: this.state.background,
        fit: [596, 842]
      },
      footer: {
        image: this.state.footer,
        fit: [596, 77]
      },
      header: {
        columns: [
          {
            image: this.state.logo,
            fit: [200, 57],
            margin: [22, 20]
          },
          {
            text: "Fiche Technique\nRéf: " + this.state.reference,
            style: "reference",
            alignment: "right"
          }
        ]
      },
      content: [
        {
          text: this.state.product,
          style: "product",
          alignment: "center"
        },
        {
          table: {
            widths: [380, 100],
            body: [
              [
                {
                  text: this.state.description,
                  border: [false, false, false, false],
                  alignment: "justify",
                  fontSize: 12,
                  margin: [60, 50, 0, 0]
                },
                {
                  image: this.state.photos[this.state.photos.length - 1],
                  border: [false, false, false, false],
                  width: 100,
                  margin: [20, 0, 0, 0],
                  alignment: "center"
                }
              ]
            ]
          }
        },
        {
          table: {
            widths: [200],
            body: [
              [
                {
                  border: [false, false, false, false],
                  text: "CARACTERISTIQUES",
                  style: "subtitle"
                }
              ]
            ]
          },
          style: "subheader"
        },
        {
          text: this.state.characteristics,
          alignment: "justify",
          style: "content"
        },
        {
          table: {
            widths: [200],
            body: [
              [
                {
                  border: [false, false, false, false],
                  text: "DIMENSIONS",
                  style: "subtitle"
                }
              ]
            ]
          },
          style: "subheader"
        },
        {
          text: this.state.dimensions,
          alignment: "justify",
          style: "content"
        },
        {
          image: this.state.schemas[this.state.schemas.length - 1],
          width: 350,
          alignment: "center",
          margin: [0, 20, 0, 20]
        },
        {
          table: {
            widths: [100, 100],
            body: [
              [
                {
                  border: [false, false, false, false],
                  text: "Date de création\nDernière mise à jour"
                },
                {
                  border: [false, false, false, false],
                  text: this.state.date + "\n" + this.state.update
                }
              ]
            ]
          },
          style: "date"
        }
      ],
      styles: {
        product: {
          fontSize: 24,
          margin: [0, 0, 0, 20]
        },
        reference: {
          fontSize: 12,
          margin: [0, 35, 50]
        },
        subheader: {
          fontSize: 12,
          fillColor: "#007f9f",
          color: "white",
          margin: [0, 10, 0, 10]
        },
        subtitle: {
          margin: [55, 0, 0, 0]
        },
        content: {
          margin: [60, 0, 0, 0],
          fontSize: 12
        },
        date: {
          margin: [0, 15, 0, 15],
          fontSize: 10
        }
      }
    };

    return (
      <Container className="MainView">
        <Message
          attached
          floating
          header="Bienvenue dans l'application !"
          content="Il faut remplir les champs ci-dessous puis valider pour éditer une nouvelle fiche."
        />
        <br />
        <br />
        <Form>
          <Form.Group widths="equal">
            <Form.TextArea
              rows={1}
              value={this.state.reference}
              onChange={evt =>
                this.setState({
                  reference: evt.target.value
                })
              }
              label="Référence"
              placeholder="Référence"
              readOnly={this.state.toggleEdit ? true : false}
            />
            <Form.Input
              value={this.state.product}
              onChange={evt =>
                this.setState({
                  product: evt.target.value
                })
              }
              label="Produit"
              placeholder="Produit"
              readOnly={this.state.toggleEdit ? true : false}
            />
          </Form.Group>
          <Form.Input
            value={this.state.description}
            onChange={evt =>
              this.setState({
                description: evt.target.value
              })
            }
            label="Description"
            placeholder="Description"
            readOnly={this.state.toggleEdit ? true : false}
          />
          <Form.TextArea
            value={this.state.characteristics}
            onChange={evt =>
              this.setState({
                characteristics: evt.target.value
              })
            }
            label="Caractéristiques"
            placeholder="Caractéristiques"
            readOnly={this.state.toggleEdit ? true : false}
          />
          <Form.TextArea
            value={this.state.dimensions}
            onChange={evt =>
              this.setState({
                dimensions: evt.target.value
              })
            }
            label="Dimensions"
            placeholder="Dimensions"
            readOnly={this.state.toggleEdit ? true : false}
          />
          <Grid
            className="imagesGrid"
            columns={2}
            divided
            verticalAlign="middle"
          >
            <Grid.Row>
              <Grid.Column width={3}>
                <label
                  htmlFor="photos"
                  id="photosUpload"
                  className="ui basic grey icon button"
                >
                  <i className="upload icon" />
                  &nbsp;&nbsp;Ajouter photo
                </label>
                <input
                  type="file"
                  id="photos"
                  name="photos[]"
                  style={{ display: "none" }}
                />
              </Grid.Column>
              <Grid.Column width={5}>
                <output id="listPhotos" />
              </Grid.Column>
              <Grid.Column width={3}>
                <label
                  htmlFor="schemas"
                  id="schemasUpload"
                  className="ui basic grey icon button"
                >
                  <i className="upload icon" />
                  &nbsp;&nbsp;Ajouter schéma
                </label>
                <input
                  type="file"
                  id="schemas"
                  name="schemas[]"
                  style={{ display: "none" }}
                />
              </Grid.Column>
              <Grid.Column width={5}>
                <output id="listSchemas" />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <br />
          <br />
          <Form.Checkbox
            toggle
            id="checkbox"
            onClick={this.notificationCheck}
            checked={this.state.checked}
            label="J'ai tout renseigné, y a plus qu'à éditer !"
          />
          <Button
            animated="fade"
            inverted
            color="green"
            disabled={this.state.toggleEdit ? false : true}
            onClick={() => pdfMake.createPdf(docDefinition).open()}
          >
            <Button.Content visible>Valider</Button.Content>
            <Button.Content hidden>
              <Icon name="checkmark" />
            </Button.Content>
          </Button>
          <Modal
            className="modalCustom"
            trigger={
              <Button
                animated="fade"
                inverted
                color="red"
                floated="right"
                disabled={this.state.toggleEdit ? true : false}
                onClick={() =>
                  this.setState({ toggleModal: !this.state.toggleModal })
                }
              >
                <Button.Content visible>Reset</Button.Content>
                <Button.Content hidden color="red">
                  <Icon name="trash" />
                </Button.Content>
              </Button>
            }
            open={this.state.toggleModal}
            basic
            size="small"
          >
            <Header icon="trash" content="Réinitialiser le formulaire" />
            <Modal.Content>
              <p>
                Le formulaire va être réinitialisé et le contenu actuel
                supprimé, t&apos;es sûr de vouloir faire ça ?
              </p>
            </Modal.Content>
            <Modal.Actions>
              <Button
                basic
                color="green"
                inverted
                onClick={() =>
                  this.setState({ toggleModal: !this.state.toggleModal })
                }
              >
                <Icon name="close" /> Non
              </Button>
              <Button color="red" inverted onClick={this.deleteEverything}>
                <Icon name="checkmark" /> Oui
              </Button>
            </Modal.Actions>
          </Modal>
        </Form>
        <br />
        <br />
        <NotificationContainer />
      </Container>
    );
  }
}

export default EntryForm;

import React, { Component } from "react";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  BreadcrumbItem,
  Breadcrumb,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Form,
  FormGroup,
  Label,
  Col,
  Row,
} from "reactstrap";
import { Link } from "react-router-dom";
import { Control, LocalForm, Errors } from "react-redux-form";
import LoadingComponent from "./LoadingComponent";

function FormatDate({ date }) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function RenderDish({ dish }) {
  if (dish != null) {
    return (
      <div>
        <Card>
          <CardImg width="100%" src={dish.image} alt={dish.name} />
          <CardBody>
            <CardTitle>{dish.name}</CardTitle>
            <CardText>{dish.description}</CardText>
          </CardBody>
        </Card>
      </div>
    );
  } else {
    return <div></div>;
  }
}

function RenderComments({ comments, addComment, dishId }) {
  if (comments != null) {
    let list = comments.map((comments) => {
      let date = comments.date;
      return (
        <li key={comments.id}>
          <p>{comments.comment}</p>
          <p>
            --{comments.author},<FormatDate date={date} />
          </p>
        </li>
      );
    });

    return (
      <div>
        <h4>Comments</h4>
        <ul className="list-unstyled">{list}</ul>
        <div>
          <CommentForm dishId={dishId} addComment={addComment} />
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}

const DishDetail = (props) => {
  //console.log(props.dish.name);

  if(props.isLoading){
    return(

      <div className="container">
        <div className="row">
          <LoadingComponent/>
        </div>
      </div>
    );
  }

  else if(props.errMess){
    return(

    <div className="container">
    <div className="row">
      <h4>{props.errMess}</h4>
    </div>
  </div>
);

  }
 

 else if (props.dish != null) {
    return (
      <div className="container">
        <div className="row">
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/menu">Menu</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
          </Breadcrumb>
          <div className="col-12">
            <h3>{props.dish.name}</h3>
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-5 m-1">
            <RenderDish dish={props.dish} />
          </div>
          <div className="col-12 col-md-5 m-1">
            <RenderComments
              comments={props.comments}
              addComment={props.addComment}
              dishId={props.dish.id}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
};

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !val || val.length <= len;
const minLength = (len) => (val) => val && val.length >= len;

class CommentForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }

  handleSubmit(values) {
    this.toggleModal();
    this.props.addComment(
      this.props.dishId,
      values.rating,
      values.author,
      values.comment
    );
  }

  render() {
    return (
      <div>
        <Button outline onClick={this.toggleModal}>
          <span className="fa fa-edit fa-lg"></span> Submit Comment
        </Button>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
          <ModalBody>
            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
              <Row className="form-group">
                <Label htmlFor="rating" md={12}>
                  Rating
                </Label>
                <Col md={12}>
                  <Control.select
                    model=".rating"
                    name="rating"
                    className="form-control"
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Control.select>
                </Col>
              </Row>
              <Row className="form-group">
                <Label htmlFor="author" md={12}>
                  Your Name
                </Label>
                <Col md={12}>
                  <Control.text
                    model=".author"
                    id="author"
                    name="author"
                    placeholder="Your Name"
                    className="form-control"
                    validators={{
                      required,
                      minLength: minLength(3),
                      maxLength: maxLength(15),
                    }}
                  />
                  <Errors
                    className="text-danger"
                    model=".author"
                    show="touched"
                    messages={{
                      required: "Required",
                      minLength: "Must be greater than 2 characters",
                      maxLength: "Must be 15 characters or less",
                    }}
                  />
                </Col>
              </Row>
              <Row className="form-group">
                <Label htmlFor="comment" md={12}>
                  Comment
                </Label>
                <Col md={12}>
                  <Control.textarea
                    model=".comment"
                    id="comment"
                    name="comment"
                    rows="6"
                    className="form-control"
                  />
                </Col>
              </Row>
              <Row className="form-group">
                <Col md={{ size: 12, offset: 0 }}>
                  <Button
                    type="submit"
                    onSubmit={(values) => this.handleSubmit(values)}
                    color="primary"
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            </LocalForm>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default DishDetail;

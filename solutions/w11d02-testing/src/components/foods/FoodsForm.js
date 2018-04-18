import React from 'react';

import BackButton from '../utility/BackButton';

function FoodsForm({ history, handleSubmit, handleChange, food, errors }) {
  return (
    <div className="row">
      <div className="page-banner col-md-12">
        <BackButton history={history} />
      </div>
      <form onSubmit={handleSubmit} className="col-md-6">
        <div className={errors.title ? 'form-group has-error' : 'form-group'}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={food.title}
            onChange={handleChange}
          />
          {errors.title && <small className="has-error">{errors.title}</small>}
        </div>
        <div className={errors.image ? 'form-group has-error' : 'form-group'}>
          <label htmlFor="image">Image</label>
          <input
            type="text"
            className="form-control"
            id="image"
            name="image"
            value={food.image}
            onChange={handleChange}
          />
          {errors.image && <small className="has-error">{errors.image}</small>}
        </div>
        <div className={errors.category ? 'form-group has-error' : 'form-group'}>
          <label htmlFor="category">Category</label>
          <select
            className="form-control"
            id="category"
            name="category"
            value={food.category}
            onChange={handleChange}
          >
            <option value="" disabled>Please Select</option>
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Desert</option>
          </select>
          {errors.category && <small className="has-error">{errors.category}</small>}
        </div>
        <div>
          <button className="save-button">Save</button>
        </div>
      </form>
    </div>
  );
}

export default FoodsForm;

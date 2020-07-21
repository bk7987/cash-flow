import React from 'react';
import { formatCurrency } from '../util';
import { connect } from 'react-redux';

const symbol = {
  'positive': (<path d="M12 4v16m8-8H4"></path>),
  'negative': (<path d="M18 12H6"></path>)
};

const symbolStyles = {
  'positive': 'text-green-900',
  'negative': 'text-red-900'
};

const TransactionBadge = ({ 
  amount = 0,
  currencyCode
}) => {
  const type = amount >= 0 ? 'positive' : 'negative';
  const styles = 'flex items-center justify-between ' + symbolStyles[type];

  return (
    <div className="flex items-center font-bold">
      <span className={ styles }>
        <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" viewBox="0 0 24 24" 
          stroke="currentColor" className="h-3 w-3"
        >
         { symbol[type] }
        </svg>
        
      </span>
      <span className="ml-1">
        { formatCurrency(amount, currencyCode, true) }
      </span>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    currencyCode: state.settings.currencyCode
  };
};

export default connect(
  mapStateToProps, 
  {}
)(TransactionBadge);
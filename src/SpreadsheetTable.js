import React, { Component } from "react";
import { TextField } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import "./styles.css";

const funds = [
  {
    FundName: "fund 1",
    FundCategoryName: "Global 1",
    FundCategoryId: 1,
    FundSubCategoryName: "Subasset Global 1",
    FundSubCategoryId: 1,
    AgeBrackets: [
      { BracketName: "bracket 1", Percentage: 3 },
      { BracketName: "bracket 2", Percentage: 3 },
      { BracketName: "bracket 3", Percentage: 3 }
    ]
  },
  {
    FundName: "fund 2",
    FundCategoryName: "Global 1",
    FundCategoryId: 1,
    FundSubCategoryName: "Subasset Global 1",
    FundSubCategoryId: 1,
    AgeBrackets: [
      { BracketName: "bracket 1", Percentage: 3 },
      { BracketName: "bracket 2", Percentage: 3 },
      { BracketName: "bracket 3", Percentage: 3 }
    ]
  },
  {
    FundName: "fund 3",
    FundCategoryName: "Global 2",
    FundCategoryId: 2,
    FundSubCategoryName: "",
    FundSubCategoryId: 0,
    AgeBrackets: [
      { BracketName: "bracket 1", Percentage: 3 },
      { BracketName: "bracket 2", Percentage: 3 },
      { BracketName: "bracket 3", Percentage: 3 }
    ]
  },
  {
    FundName: "fund 4",
    FundCategoryName: "Global 2",
    FundCategoryId: 2,
    FundSubCategoryName: "Subasset Global 2",
    FundSubCategoryId: 3,
    AgeBrackets: [
      { BracketName: "bracket 1", Percentage: 3 },
      { BracketName: "bracket 2", Percentage: 3 },
      { BracketName: "bracket 3", Percentage: 3 }
    ]
  },
  {
    FundName: "fund 5",
    FundCategoryName: "Global 3",
    FundCategoryId: 3,
    FundSubCategoryName: "Subasset Global 3",
    FundSubCategoryId: 5,
    AgeBrackets: [
      { BracketName: "bracket 1", Percentage: 3 },
      { BracketName: "bracket 2", Percentage: 3 },
      { BracketName: "bracket 3", Percentage: 3 }
    ]
  }
];

export default class SpreadsheetTable extends Component {
  state = {
    fundsState: funds
  };

  bracketNames = funds[0].AgeBrackets.map((bracket) => bracket.BracketName);

  onBracketValueChangeHandler = (value, fundIndex, bracketIndex) => {
    console.log(
      `Percentage: ${value}, fundIndex: ${fundIndex}, bracketIndex: ${bracketIndex}`
    );
    const updatedFundsState = this.state.fundsState;
    updatedFundsState[fundIndex].AgeBrackets[
      bracketIndex
    ].Percentage = parseInt(value, 10);
    this.setState({ fundsState: updatedFundsState });
  };

  onAssetClickHandler = (FundCategoryId) => {
    console.log("FundCategoryId: ", FundCategoryId);
  };

  calculateAssetColumnTotal = (fundsState, FundCategoryId, bracketIndex) => {
    // console.log("calculateAssetColumnTotal FundCategoryId: ", FundCategoryId);
    // console.log("calculateAssetColumnTotal bracketIndex: ", bracketIndex);
    let sum = 0;
    fundsState.forEach((fund, fundIndex) => {
      if (fund.FundCategoryId === FundCategoryId) {
        sum += fundsState[fundIndex].AgeBrackets[bracketIndex].Percentage;
      }
    });
    return sum;
  };

  calculateAllAssetsColumnTotal = (fundsState, bracketIndex) =>
    fundsState.reduce(
      (sum, fund, fundIndex) =>
        sum + fundsState[fundIndex].AgeBrackets[bracketIndex].Percentage,
      0
    );

  renderBracketHeaders = (bracketNames) =>
    bracketNames.map((BracketName) => {
      return <th key={`bracket_${BracketName}`}>{BracketName}</th>;
    });

  renderTotalValues = (AgeBrackets, fundsState) =>
    AgeBrackets.map((bracket, bracketIndex) => (
      <td key={`template_total_${bracketIndex}`} className="totals">
        {this.calculateAllAssetsColumnTotal(fundsState, bracketIndex)}
      </td>
    ));

  renderBracketValues = (AgeBrackets, fundIndex) => {
    return AgeBrackets.map((bracket, bracketIndex) => {
      // console.log(
      //   `fundIndex: ${fundIndex}, bracketIndex: ${bracketIndex}`
      // );
      return (
        <td key={`bracket_${fundIndex}_${bracketIndex}`}>
          <TextField
            id="outlined-number"
            label=""
            type="number"
            inputProps={{ min: "0", max: "100" }}
            // style={{ minWidth: "40px" }}
            variant="outlined"
            // InputLabelProps={{
            //   shrink: true
            // }}
            fullWidth
            onChange={(e) =>
              this.onBracketValueChangeHandler(
                e.target.value,
                fundIndex,
                bracketIndex
              )
            }
            value={
              this.state.fundsState[fundIndex].AgeBrackets[bracketIndex]
                .Percentage
            }
          />
        </td>
      );
    });
  };

  renderSubtotalsRow = (
    fundsState,
    AgeBrackets,
    FundCategoryId,
    FundCategoryName,
    fundIndex
  ) => {
    // console.log("renderSubtotalsRow fundsState: ", fundsState);
    // console.log("renderSubtotalsRow AgeBrackets: ", AgeBrackets);
    // console.log("renderSubtotalsRow FundCategoryId: ", FundCategoryId);
    // console.log("renderSubtotalsRow FundCategoryName: ", FundCategoryName);
    // console.log("renderSubtotalsRow fundIndex: ", fundIndex);
    return (
      <tr key={`asset_subtotal_${FundCategoryName}_${fundIndex}`}>
        <td>Subtotals {FundCategoryName}</td>
        {AgeBrackets.map((bracket, bracketIndex) => (
          <td className="totals">
            {this.calculateAssetColumnTotal(
              fundsState,
              FundCategoryId,
              bracketIndex
            )}
          </td>
        ))}
      </tr>
    );
  };

  renderFunds = (fundsState, AgeBrackets) => {
    let previousFundCategoryId = 0;
    let previousFundSubCategoryId = 0;
    let previousFundCategoryName = "";
    let previousFundIndex = 0;
    return fundsState.map((fund, fundIndex) => {
      // check on new asset or subasset
      const isNewAssetId = fund.FundCategoryId !== previousFundCategoryId;
      const isNewSubAssetId =
        fund.FundSubCategoryId !== previousFundSubCategoryId;
      const rows = [];

      if (previousFundCategoryId > 0 && isNewAssetId && fundIndex > 0) {
        rows.push(
          this.renderSubtotalsRow(
            fundsState,
            AgeBrackets,
            previousFundCategoryId,
            previousFundCategoryName,
            previousFundIndex
          )
        );
      }

      if (isNewAssetId) {
        previousFundCategoryId = fund.FundCategoryId;
        previousFundCategoryName = fund.FundCategoryName;
        previousFundIndex = fundIndex;
      }
      if (isNewSubAssetId) previousFundSubCategoryId = fund.FundSubCategoryId;

      if (isNewAssetId) {
        rows.push(
          <tr
            key={`asset_${fund.FundCategoryName}_${fundIndex}`}
            className="assetLabel"
          >
            <td colSpan="100%">{fund.FundCategoryName}</td>
          </tr>
        );
      }

      if (isNewSubAssetId)
        rows.push(
          <tr key={`subasset_${fund.FundSubCategoryName}_${fundIndex}`}>
            <td colSpan="100%">{fund.FundSubCategoryName}</td>
          </tr>
        );

      rows.push(
        <tr key={`fund_${fund.FundName}_${fundIndex}`}>
          <td>{fund.FundName}</td>
          {this.renderBracketValues(AgeBrackets, fundIndex)}
        </tr>
      );

      if (fundIndex === fundsState.length - 1) {
        rows.push(
          this.renderSubtotalsRow(
            fundsState,
            AgeBrackets,
            fund.FundCategoryId,
            fund.FundCategoryName,
            fundIndex
          )
        );
      }

      return rows;
    });
  };

  render() {
    return (
      <div className="App">
        <h1>Spreadsheet like table</h1>
        <div>
          <table>
            <thead>
              <tr>
                <th></th>
                {this.renderBracketHeaders(this.bracketNames)}
              </tr>
            </thead>

            <tbody>
              {this.renderFunds(
                funds,
                this.bracketNames,
                this.state.fundsState
              )}
            </tbody>

            <tfoot>
              <tr>
                <td key="asset_total_label" className="total">
                  Totals
                </td>
                {this.renderTotalValues(
                  this.bracketNames,
                  this.state.fundsState
                )}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  }
}

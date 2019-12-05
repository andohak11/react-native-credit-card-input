import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  Image,
  LayoutAnimation,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";

import Icons from "./Icons";
import CCInput from "./CCInput";
import { InjectedProps } from "./connectToState";

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class LiteCreditCardInput extends Component {
  static propTypes = {
    ...InjectedProps,

    placeholders: PropTypes.object,

    inputStyle: Text.propTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    additionalInputsProps: PropTypes.objectOf(PropTypes.shape(TextInput.propTypes)),
  };

  static defaultProps = {
    placeholders: {
      number: "1234 5678 1234 5678",
      expiry: "MM/YY",
      cvc: "CVC",
    },
    validColor: "",
    invalidColor: "red",
    placeholderColor: "gray",
    additionalInputsProps: {},
  };

  componentDidMount = () => this._focus(this.props.focused);

  componentWillReceiveProps = newProps => {
    if (this.props.focused !== newProps.focused) this._focus(newProps.focused);
  };

  _focusNumber = () => this._focus("number");
  _focusExpiry = () => this._focus("expiry");

  _focus = field => {
    if (!field) return;
    this.refs[field].focus();
    LayoutAnimation.easeInEaseOut();
  }

  _inputProps = field => {
    const {
      validColor, invalidColor, placeholderColor,
      placeholders, values, status,
      onFocus, onChange, onBecomeEmpty, onBecomeValid,
      additionalInputsProps,
    } = this.props;

    return {
      validColor, invalidColor, placeholderColor,
      ref: field, field,

      placeholder: placeholders[field],
      value: values[field],
      status: status[field],

      onFocus, onChange, onBecomeEmpty, onBecomeValid,
      additionalInputProps: additionalInputsProps[field],
    };
  };

  _iconToShow = () => {
    const { focused, values: { type } } = this.props;
    if (focused === "cvc" && type === "american-express") return "cvc_amex";
    if (focused === "cvc") return "cvc";
    if (type) return type;
    return "placeholder";
  }

  render() {
    const { focused } = this.props;

    return (
      <View style={s.container}>
        <View style={s.numberContainer}>
          <CCInput {...this._inputProps("number")}
            keyboardType="numeric"
            inputStyle={{...s.inputStyle, ...s.numberStyle}}
            focused={focused === 'number'} />
            <Image style={s.icon} source={Icons[this._iconToShow()]} />
        </View>
        <View style={s.bottom}>
          <CCInput {...this._inputProps("expiry")}
            inputStyle={{...s.inputStyle, ...s.bottomInput}}
            keyboardType="numeric"
            focused={focused === 'expiry'} />
          <CCInput {...this._inputProps("cvc")}
            inputStyle={{...s.inputStyle, ...s.bottomInput}}
            keyboardType="numeric"
            focused={focused === 'cvc'}/>
        </View>
      </View>
    );
  }
}

const s = StyleSheet.create({
  container: {
    marginTop: -25,
  },
  inputStyle: {
    zIndex: 2,
    height: 61
  },
  numberStyle: {
    borderWidth: 1,
    paddingRight: 70,
  },
  icon: {
    width: 48,
    height: 40,
    resizeMode: "contain",
    position: 'absolute',
    right: 18,
    top: 10,
  },
  bottom: {
    flexDirection: 'row',
    paddingTop: 22,
    marginHorizontal: -11,
  },
  bottomInput: {
    width: (Dimensions.get('window').width - 82) / 2,
    height: 61,
    marginHorizontal: 11,
  },
  expanded: {
    flex: 1,
  },
  hidden: {
    width: 0,
  },
  leftPart: {
    overflow: "hidden",
  },
  rightPart: {
    overflow: "hidden",
    flexDirection: "row",
  },
  last4: {
    flex: 1,
    justifyContent: "center",
  },
  expiryInput: {
    width: 80,
  },
  cvcInput: {
    width: 80,
  },
  last4Input: {
    width: 60,
    marginLeft: 20,
  },
  input: {
    height: 40,
    color: "black",
  },
});

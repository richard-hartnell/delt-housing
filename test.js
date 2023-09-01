import { assert } from "chai";
import Calc from "../calc.js";


describe('Calc', () => {
    describe('.add', () => {
      it('returns the sum of two values', () => {
        // Your test goes here
        const calc = new Calc();
        const answer = calc.add(1,2);
        assert.strictEqual(answer, 3);
      });
    });
    describe('.subtract', () => {
      it('returns the difference of two values', () => {
        // Your test goes here
        const calc = new Calc();
        const answer = calc.subtract(1,10);
        assert.strictEqual(answer, -9);
      });
    });
  });
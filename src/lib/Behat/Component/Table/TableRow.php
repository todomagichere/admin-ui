<?php

/**
 * @copyright Copyright (C) Ibexa AS. All rights reserved.
 * @license For full copyright and license information view LICENSE file distributed with this source code.
 */
declare(strict_types=1);

namespace Ibexa\AdminUi\Behat\Component\Table;

use Behat\Mink\Session;
use Ibexa\Behat\Browser\Component\Component;
use Ibexa\Behat\Browser\Element\ElementInterface;
use Ibexa\Behat\Browser\Locator\LocatorCollection;
use Ibexa\Behat\Browser\Locator\LocatorInterface;
use Ibexa\Behat\Browser\Locator\VisibleCSSLocator;

class TableRow extends Component
{
    /** @var \Ibexa\Behat\Browser\Element\ElementInterface */
    private $element;

    /** @var \Ibexa\Behat\Browser\Locator\LocatorCollection */
    private $locatorCollection;

    public function __construct(Session $session, ElementInterface $element, LocatorCollection $locatorCollection)
    {
        parent::__construct($session);
        $this->element = $element;
        $this->locatorCollection = $locatorCollection;
    }

    public function goToItem(): void
    {
        // TODO: Revisit during redesign
        $this->element->find($this->getLocator('link'))->mouseOver();
        usleep(100 * 5000); // 500ms
        $this->element->find($this->getLocator('link'))->click();
    }

    public function select(): void
    {
        $this->element->find($this->getLocator('checkbox'))->click();
    }

    public function edit(): void
    {
        // TODO: Revisit during redesign
        $this->element->find($this->getLocator('edit'))->mouseOver();
        usleep(100 * 5000); // 500ms
        $this->element->find($this->getLocator('edit'))->click();
    }

    public function copy(): void
    {
        // TODO: Revisit during redesign
        $this->element->find($this->getLocator('copy'))->mouseOver();
        usleep(100 * 5000); // 500ms
        $this->element->find($this->getLocator('copy'))->click();
    }

    public function deactivate(): void
    {
        // TODO: Revisit during redesign
        $this->element->find($this->getLocator('de-active'))->mouseOver();
        usleep(100 * 5000); // 500ms
        $this->element->find($this->getLocator('de-active'))->click();
    }

    public function activate(): void
    {
        // TODO: Revisit during redesign
        $this->element->find($this->getLocator('active'))->mouseOver();
        usleep(100 * 5000); // 500ms
        $this->element->find($this->getLocator('active'))->click();
    }

    public function assign(): void
    {
        // TODO: Revisit during redesign
        $this->element->mouseOver();
        $this->element->find($this->getLocator('assign'))->click();
    }

    public function getCellValue(string $headerName): string
    {
        return $this->element->find($this->locatorCollection->get($headerName))->getText();
    }

    public function getCell(string $headerName): ElementInterface
    {
        return $this->element->find($this->locatorCollection->get($headerName));
    }

    public function verifyIsLoaded(): void
    {
    }

    public function click(LocatorInterface $locator)
    {
        $this->element->find($locator)->click();
    }

    public function canBeSelected(): bool
    {
        $disabled = $this->element->find($this->getLocator('checkbox'))->getAttribute('disabled');

        return $disabled !== 'true' && $disabled !== 'disabled';
    }

    protected function specifyLocators(): array
    {
        return [
            new VisibleCSSLocator('link', 'a'),
            new VisibleCSSLocator('checkbox', 'input[type=checkbox]'),
            new VisibleCSSLocator('assign', '[data-original-title="Assign content"],[data-original-title="Assign to Users/Groups"]'),
            new VisibleCSSLocator('edit', '.ibexa-icon--edit,[data-original-title="Edit"]'),
            new VisibleCSSLocator('de-active', '[data-original-title="De-activate"]'),
            new VisibleCSSLocator('active', '[data-original-title="Activate"]'),
            new VisibleCSSLocator('copy', '[data-original-title="Copy"]'),
        ];
    }
}
